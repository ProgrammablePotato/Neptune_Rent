import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-pcs',
  templateUrl: './pcs.component.html',
  styleUrl: './pcs.component.css'
})
export class PcsComponent {
  products: any = []
  pcs: any = []
  pcNews: any[] = []
  currentSlideIndex: number = 0;

  constructor(private base: BaseService, private http: HttpClient, private router: Router, private news: NewsService) {
      this.base.currentPage = this.router.url
      this.getPCs()
      this.getNews()
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
