import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { BaseService } from '../base.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  allNews:any = []
  currentSlideIndex: number = 0
  
  allProducts:any = []
  products:any = []
  filteredProducts:any = []
  
  category:string = ''
  searchTerm: string = '' 
  brands:any[] = []
  
  constructor(private news:NewsService, private base:BaseService, private router:Router, private search:SearchService, private activated:ActivatedRoute){
    
  }
  ngOnInit(): void {
    this.base.currentPage = this.router.url
    this.category = String(this.activated.snapshot.paramMap.get('category'))
    this.getNewsNew()
    this.getProducts()
    
  }
  
  // async getNews(){
  //   this.news.getTechNews().subscribe((data) => {
  //     this.allNews = data.articles.slice(0, 5)
  //     console.log(this.allNews)
  //   })
  // }
  
  async getNewsNew() {
    await this.news.getTechNewsNew(this.category).then((news:any) => {
      this.allNews = news
    }).catch((error) => {
      console.log("Nem jó")
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
    this.allProducts = await this.base.getProducts()
    console.log("Products: ", this.products)
    this.base.roundPrices()
    this.filterCategory()
    this.filteredProducts = this.products
    this.getBrandNames()
  }
  filterCategory() {
    this.allProducts.forEach((product:any) => {
      if (product.category == this.category) {
        this.products.push(product)
      }
    })
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
    console.log("Brand names:"+this.brands)
  }
}
