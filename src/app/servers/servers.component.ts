import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.css'
})
export class ServersComponent {
  products: any = []
  servers: any = []
  serverNews: any[] = []
  currentSlideIndex: number = 0;

  constructor(private base: BaseService, private http: HttpClient, private router: Router, private news: NewsService) {
    this.base.currentPage = this.router.url
    this.getServers()
  }

  async getServers() {
    this.servers = await this.base.getProductsByCategory("servers")
    console.log("Servers: ", this.servers)
    this.base.roundPrices()
  }

  getImages(){
    this.servers.forEach((server:any) => {
      if(!server.image){

      }
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
