import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { NewsService } from '../news.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})
export class AccessoriesComponent {
  accessories: any = []
  filteredAccessories: any[] = []
  accNews: any[] = []
  currentSlideIndex: number = 0
  searchTerm: string = ''
  brands: any[] = []

  constructor(private base: BaseService, private router: Router, private news: NewsService, private search:SearchService) {
    this.base.currentPage = this.router.url
    this.getAccessories()
    this.getNews()
    this.getProductsByBrand()
  }

  getProductsByBrand() {
    this.base.getProdByBrand().subscribe((data) => {
      this.brands = data as any[]
      console.log("Brand: ", this.brands)
    })
  }

  async getNews(){
    this.news.getAccessNews().subscribe((data) => {
      this.accNews = data.articles.slice(0, 5)
      console.log(this.accNews)
    })
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }

  async getAccessories() {
    this.accessories = await this.base.getProductsByCategory("accessories")
    this.filteredAccessories = this.accessories
    console.log("Accessories: ", this.accessories)
    this.base.roundPrices()
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = this.accNews.length - 1
      console.log(this.currentSlideIndex)
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.accNews.length - 1) {
      this.currentSlideIndex++
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = 0
      console.log(this.currentSlideIndex)
    }
  }

  filterBrand(brand:String) {
    for (let i = 0; i < this.accessories.length; i++) {
      if (this.accessories[i].brand === brand) {
        this.filteredAccessories.push(this.accessories[i])
      }
    }
  }
  resetFilter() {
    this.filteredAccessories = this.accessories
  }
}
