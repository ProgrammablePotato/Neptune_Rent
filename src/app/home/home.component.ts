import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { CookiesService } from '../cookies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories = ["Accessories","PCs","Laptops","Servers","Services"]
  descriptions = [
    "Various useful accessories for everyday computer usage, from keyboards to headsets, all in one place",
    "Powerful gaming PCs and small office desktops are available from website, choose the one most suitable for you",
    "Notebooks, gaming laptops, work laptops in various styles for all applications",
    "Fill your server room with state-of-the-art hardware and customisable servers",
    "NeptuneRent offers maintenance and other services for their customers, so you never feel lost with your hardware"
  ]
  cards:any[] = []
  imageUrls:string[] = []

  allNews:any = []
  currentSlideIndex: number = 0

  products:any = []
  filteredProducts:any = []

  searchTerm: string = ''
  brands:any[] = []
  loggedUser:any
  sqlUserId: string = ''
  errorMessage: string = ''

  recentProducts: any[] = [];

  constructor(private news:NewsService, private base:BaseService, private router:Router, private search:SearchService, private auth:AuthService, private cart:CartService, private cookies: CookiesService){
    this.initCategoryCards()
    this.auth.getLoggedUser().subscribe((user) => {
      this.loggedUser = user
    })
  }

  ngOnInit(): void {
    this.base.currentPage = this.router.url
    this.getNewsNew()
    this.getProducts()
    this.cartUserIdFixer()
    this.showError()
    this.loadRecentProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  showError(){
    this.cart.errorMessage.subscribe(msg => {
      this.errorMessage = msg
      if (msg) {
        setTimeout(() => {
          this.errorMessage = ''
        }, 5000)
      }
    })
  }

  cartUserIdFixer(){
    this.cart.userId$.subscribe((id) => {
      this.sqlUserId = id
    })
  }

  async getNewsNew() {
    await this.news.getTechNews('all').then((news:any) => {
      this.allNews = news
    }).catch((error) => {
      console.log("Not good")
    })
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product: any) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }

  async getProducts() {
    this.products = await this.base.getProducts()
    this.base.roundPrices()
    this.filteredProducts = this.products
    this.getBrandNames()
  }

  filterBrand(brand:String) {
    this.filteredProducts = []
    this.products.forEach((element:any) => {
      if (element.brand == brand) {
        this.filteredProducts.push(element)
      }
    })
    this.hideDropdown()
    console.log(this.filteredProducts)
  }

  resetFilter() {
    this.hideDropdown()
    this.filteredProducts = this.products
  }

  hideDropdown() {
    let dropdown = document.getElementById("dropdown")
    console.log(dropdown?.getAttribute("aria-hidden"))
    dropdown?.setAttribute("aria-hidden","false")
  }

  getNewsNumber(news:any) {
    return this.allNews.indexOf(news)
  }

  getBrandNames() {
    for (let i = 0; i < this.products.length; i++) {
      if (!this.brands.includes(this.products[i].brand)) {
        this.brands.push(this.products[i].brand)
      }
    }
  }

  initCategoryCards() {
    let right = true
    this.categories.forEach((category:string) => {
      let card = {
        title : category,
        description : this.descriptions[this.categories.indexOf(category)],
        image : ""
      }
      this.base.getLatestImageForCategory(category.toLowerCase()).subscribe((data:any) => {
        card.image = data[0].image_url
      })
      this.cards.push(card)
    })
  }

  getRoute(cat:string) {
    return "../products/"+(cat.toLowerCase())
  }

  async loadRecentProducts() {
    const recentProductIds = this.cookies.getRecentProducts()
    const allProducts = await this.base.getProducts()
    this.recentProducts = recentProductIds
      .map(id => allProducts.find(product => product.id.toString() === id))
      .filter(product => product !== undefined);
  }
}
