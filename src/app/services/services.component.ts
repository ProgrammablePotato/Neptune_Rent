import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { NewsService } from '../news.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  products: any = []

  services: any = []
  filteredServices:any = []

  serviceNews: any[] = []
  currentSlideIndex: number = 0
  searchTerm: string = ''
  brands:any[] = []

  constructor(private base: BaseService, private search: SearchService, private router: Router, private news: NewsService) {
    this.base.currentPage = this.router.url
    this.getServices()
    this.getNews()
  }

  async getServices() {
    this.services = await this.base.getProductsByCategory("services")
    console.log("Services: ", this.services)
    this.base.roundPrices()
    this.filteredServices = this.services
    this.getBrandNames()
  }

  async getNews() {
    this.news.getTechNewsNew('services').then((data:any) => {
      this.serviceNews = data.articles.slice(0, 5)
      console.log(this.serviceNews)
    })
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }

  filterBrand(brand:String) {
    this.filteredServices = []
    this.services.forEach((element:any) => {
      if (element.brand == brand) {
        this.filteredServices.push(element)
      }
    })
    this.hideDropdown()
    console.log(this.filteredServices)
  }
  resetFilter() {
    this.hideDropdown()
    this.filteredServices = this.services
  }
  hideDropdown() {
    let dropdown = document.getElementById("dropdown")
    console.log(dropdown?.getAttribute("aria-hidden"))
    dropdown?.setAttribute("aria-hidden","false")
  }
  getNewsNumber(news:any) {
    return this.serviceNews.indexOf(news)
  }
  getBrandNames() {
    for (let i = 0; i < this.services.length; i++) {
      if (!this.brands.includes(this.services[i].brand)) {
        this.brands.push(this.services[i].brand)
      }
    }
    console.log("Brand names:"+this.brands)
  }
  filterProducts() {
    this.filteredServices = this.services.filter((product: any) => 
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }
}
