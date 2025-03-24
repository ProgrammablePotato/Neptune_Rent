import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { NewsService } from '../news.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-pcs',
  templateUrl: './pcs.component.html',
  styleUrl: './pcs.component.css'
})
export class PcsComponent {
  products: any = []
  pcs: any = []
  pcNews: any[] = []
  currentSlideIndex: number = 0
  searchTerm: string = ''
  brand: any[] = []

  constructor(private base: BaseService, private search: SearchService, private router: Router, private news: NewsService) {
    this.base.currentPage = this.router.url
    this.getPCs()
    this.getNews()
    this.getProductsByBrand()
  }

  async getPCs() {
    this.pcs = await this.base.getProductsByCategory("pcs")
    console.log("pcs: ", this.pcs)
    this.base.roundPrices()
  }

  async getNews(){
    this.news.getPcNews().subscribe((data) => {
      this.pcNews = data.articles.slice(0, 5)
      console.log(this.pcNews)
    })
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }

  getProductsByBrand() {
    this.base.getProdByBrand().subscribe((data) => {
      this.brand = data as any[]
      console.log("Brand: ", this.brand)
    })
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = this.pcNews.length - 1
      console.log(this.currentSlideIndex)
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.pcNews.length - 1) {
      this.currentSlideIndex++
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = 0
      console.log(this.currentSlideIndex)
    }
  }
}
