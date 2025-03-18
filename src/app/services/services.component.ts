import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  products: any = []
  services: any = []
  serviceNews: any[] = []
  currentSlideIndex: number = 0;

  constructor(private base: BaseService, private http: HttpClient, private router: Router, private news: NewsService) {
    this.base.currentPage = this.router.url
    this.getServices()
    this.getNews()
  }

  async getServices() {
    this.services = await this.base.getProductsByCategory("services")
    console.log("Services: ", this.services)
    this.base.roundPrices()
  }

  async getNews() {
    this.news.getServiceNews().subscribe((data) => {
      this.serviceNews = data.articles.slice(0, 5)
      console.log(this.serviceNews)
    })
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = this.serviceNews.length - 1
      console.log(this.currentSlideIndex)
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.serviceNews.length - 1) {
      this.currentSlideIndex++
      console.log(this.currentSlideIndex)
    } else {
      this.currentSlideIndex = 0
      console.log(this.currentSlideIndex)
    }
  }
}
