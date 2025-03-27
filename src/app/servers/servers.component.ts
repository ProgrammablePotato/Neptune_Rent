import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { NewsService } from '../news.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.css'
})
export class ServersComponent {
  products: any = []

  servers: any = []
  filteredServers:any = []

  serverNews: any[] = []
  currentSlideIndex: number = 0
  searchTerm: string = ''
  brands: any[] = []

  constructor(private base: BaseService, private search: SearchService, private router: Router, private news: NewsService) {
    this.base.currentPage = this.router.url
    this.getServers()
    this.getNews()
  }

  async getServers() {
    this.servers = await this.base.getProductsByCategory("servers")
    console.log("Servers: ", this.servers)
    this.base.roundPrices()
    this.filteredServers = this.servers
    this.getBrandNames()
  }

  async getNews() {
    this.news.getServerNews().subscribe((data) => {
      this.serverNews = data.articles.slice(0, 5)
      console.log(this.serverNews)
    })
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }

  filterBrand(brand:String) {
    this.filteredServers = []
    this.servers.forEach((element:any) => {
      if (element.brand == brand) {
        this.filteredServers.push(element)
      }
    })
    this.hideDropdown()
    console.log(this.filteredServers)
  }
  resetFilter() {
    this.hideDropdown()
    this.filteredServers = this.servers
  }
  hideDropdown() {
    let dropdown = document.getElementById("dropdown")
    console.log(dropdown?.getAttribute("aria-hidden"))
    dropdown?.setAttribute("aria-hidden","false")
  }
  getNewsNumber(news:any) {
    return this.serverNews.indexOf(news)
  }
  getBrandNames() {
    for (let i = 0; i < this.servers.length; i++) {
      if (!this.brands.includes(this.servers[i].brand)) {
        this.brands.push(this.servers[i].brand)
      }
    }
    console.log("Brand names:"+this.brands)
  }
}
