import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { NewsService } from '../news.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-laptops',
  templateUrl: './laptops.component.html',
  styleUrl: './laptops.component.css'
})
export class LaptopsComponent {
  products: any = []
  laptops: any = []
  laptopNews: any[] = []
  currentSlideIndex: number = 0
  searchTerm: string = ''
  brands: any[] = []

  constructor(private base: BaseService, private search: SearchService, private router: Router, private news: NewsService) {
    this.base.currentPage = this.router.url
    this.getLaptops()
    this.getNews()
  }

  async getLaptops() {
    this.laptops = await this.base.getProductsByCategory("laptops")
    console.log("Laptops: ", this.laptops)
    this.base.roundPrices()
  }

  async getNews(){
    this.news.getLaptopNews().subscribe((data) => {
      this.laptopNews = data.articles.slice(0, 5)
      console.log(this.laptopNews)
    })
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = this.laptopNews.length - 1
      console.log(this.currentSlideIndex)
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.laptopNews.length - 1) {
      this.currentSlideIndex++
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = 0
      console.log(this.currentSlideIndex)
    }
  }
  filterBrand(brand:String) {

  }
}
