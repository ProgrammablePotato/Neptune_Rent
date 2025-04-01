import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { BaseService } from '../base.service';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { SearchService } from '../search.service';
import { initFlowbite, initCarousels, initDropdowns } from 'flowbite';
import { AppComponent } from '../app.component';
import { dropdownCollapse, dropdownExtend } from '../app.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  public dropdownCollapse = dropdownCollapse
  public dropdownExtend = dropdownExtend
  activeNews:any
  nextNews:any

  categoryNews:any = []
  
  allProducts:any = []
  products:any = []
  filteredProducts:any = []
  
  category:string = ''
  searchTerm: string = '' 
  brands:any[] = []
  
  constructor(private news:NewsService, private base:BaseService, private router:Router, private search:SearchService, private activated:ActivatedRoute){
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }
  ngOnInit() {
    this.base.currentPage = this.router.url
    this.category = String(this.activated.snapshot.paramMap.get('category'))
    this.getProducts()
    this.getNewsNew()
    initFlowbite()
  }
  
  // async getNews(){
  //   this.news.getTechNews().subscribe((data) => {
  //     this.allNews = data.articles.slice(0, 5)
  //     console.log(this.allNews)
  //   })
  // }
  
  async getNewsNew() {
    await this.news.getTechNewsNew(this.category).then((news:any) => {
      this.categoryNews = news
      console.log("Filtered news: ", news)
    }).catch((error) => {
      console.log("Nem jó")
    })
    this.activeNews = this.categoryNews[0]
    this.activeNews = this.categoryNews[1]
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
    dropdownCollapse('brand')
  }
  resetFilter() {
    this.filteredProducts = this.products
    dropdownCollapse('brand')
  }
  getNewsNumber(news:any) {
    return this.categoryNews.indexOf(news)
  }
  getBrandNames() {
    for (let i = 0; i < this.products.length; i++) {
      if (!this.brands.includes(this.products[i].brand)) {
        this.brands.push(this.products[i].brand)
      }
    }
    console.log("Brand names:"+this.brands)
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])});
  }
}

