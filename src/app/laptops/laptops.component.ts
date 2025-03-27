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
  filteredLaptops: any = []

  laptopNews: any[] = []
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
    this.filteredLaptops = this.laptops
    this.getBrandNames()
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
  filterBrand(brand:String) {
    this.filteredLaptops = []
    this.laptops.forEach((element:any) => {
      if (element.brand == brand) {
        this.filteredLaptops.push(element)
      }
    })
    this.hideDropdown()
    console.log(this.filteredLaptops)
  }
  resetFilter() {
    this.hideDropdown()
    this.filteredLaptops = this.laptops
  }
  hideDropdown() {
    let dropdown = document.getElementById("dropdown")
    console.log(dropdown?.getAttribute("aria-hidden"))
    dropdown?.setAttribute("aria-hidden","false")
  }
  getNewsNumber(news:any) {
    return this.laptopNews.indexOf(news)
  }
  getBrandNames() {
    for (let i = 0; i < this.laptops.length; i++) {
      if (!this.brands.includes(this.laptops[i].brand)) {
        this.brands.push(this.laptops[i].brand)
      }
    }
    console.log("Brand names:"+this.brands)
  }
}
