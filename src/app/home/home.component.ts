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

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = this.allNews.length - 1
      console.log(this.currentSlideIndex)
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.allNews.length - 1) {
      this.currentSlideIndex++
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = 0
      console.log(this.currentSlideIndex)
    }
  }

  async getProducts() {
    this.products = await this.base.getProducts()
    console.log("Products: ", this.products)
    this.base.roundPrices()
  }

  async getProductsByCategory(cat: string) {
    this.products = await this.base.getProductsByCategory(cat)
    console.log("Products: ", this.products)
    this.base.roundPrices()
  }
  searchProducts() {

  }
}
