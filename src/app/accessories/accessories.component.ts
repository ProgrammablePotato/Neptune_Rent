import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})
export class AccessoriesComponent {
  products: any = []
  accessories: any = []
  accNews: any[] = []
  currentSlideIndex: number = 0;

  constructor(private base: BaseService, private http: HttpClient, private router: Router, private news: NewsService) { 
    this.base.currentPage = this.router.url
    this.getAccessories()
  }

  async getAccessories() {
    this.accessories = await this.base.getProductsByCategory("accessories")
    console.log("Accessories: ", this.accessories)
  }

  getImages(){
    this.accessories.forEach((laptop:any) => {
      if(!laptop.image){
        
      }
    })
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
}
