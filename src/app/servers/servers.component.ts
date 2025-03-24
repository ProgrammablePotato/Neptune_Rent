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
  serverNews: any[] = []
  currentSlideIndex: number = 0
  searchTerm: string = ''

  constructor(private base: BaseService, private search: SearchService, private router: Router, private news: NewsService) {
    this.base.currentPage = this.router.url
    this.getServers()
    this.getNews()
  }

  async getServers() {
    this.servers = await this.base.getProductsByCategory("servers")
    console.log("Servers: ", this.servers)
    this.base.roundPrices()
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

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = this.serverNews.length - 1
      console.log(this.currentSlideIndex)
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.serverNews.length - 1) {
      this.currentSlideIndex++
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = 0
      console.log(this.currentSlideIndex)
    }
  }
}
