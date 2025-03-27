import { Component } from '@angular/core';
import { NewsService } from '../news.service';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  allNews:any = []
  currentSlideIndex: number = 0

  products:any = []
  filteredProducts:any = []

  searchTerm: string = '' 
  brands:any[] = []

  constructor(private news:NewsService, private base:BaseService, private router:Router, private search:SearchService){
    this.base.currentPage = this.router.url
    this.getNews()
    this.getProducts()
  }

  async getNews(){
    this.news.getTechNews().subscribe((data) => {
      this.allNews = data.articles.slice(0, 5)
      console.log(this.allNews)
    })
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }

  async getProducts() {
    this.products = await this.base.getProducts()
    console.log("Products: ", this.products)
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
    console.log("Brand names:"+this.brands)
  }
}