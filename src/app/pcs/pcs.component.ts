import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { NewsService } from '../news.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-pcs',
  templateUrl: './pcs.component.html',
  styleUrl: './pcs.component.css'
})
export class PcsComponent {
  products: any = []

  pcs: any = []
  filteredPcs:any = []

  pcNews: any[] = []
  currentSlideIndex: number = 0
  searchTerm: string = ''
  brands: any[] = []

  constructor(private base: BaseService, private search: SearchService, private router: Router, private news: NewsService) {
    this.base.currentPage = this.router.url
    this.getPCs()
    this.getNews()
  }

  async getPCs() {
    this.pcs = await this.base.getProductsByCategory("pcs")
    console.log("pcs: ", this.pcs)
    this.base.roundPrices()
    this.filteredPcs = this.pcs
    this.getBrandNames()
  }

  async getNews(){
    this.news.getPcNews().then((data) => {
      this.pcNews = data.articles.slice(0, 5)
      console.log(this.pcNews)
    })
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }
  filterBrand(brand:String) {
    this.filteredPcs = []
    this.pcs.forEach((element:any) => {
      if (element.brand == brand) {
        this.filteredPcs.push(element)
      }
    })
    this.hideDropdown()
    console.log(this.filteredPcs)
  }
  resetFilter() {
    this.hideDropdown()
    this.filteredPcs = this.pcs
  }
  hideDropdown() {
    let dropdown = document.getElementById("dropdown")
    console.log(dropdown?.getAttribute("aria-hidden"))
    dropdown?.setAttribute("aria-hidden","false")
  }
  getNewsNumber(news:any) {
    return this.pcNews.indexOf(news)
  }
  getBrandNames() {
    for (let i = 0; i < this.pcs.length; i++) {
      if (!this.brands.includes(this.pcs[i].brand)) {
        this.brands.push(this.pcs[i].brand)
      }
    }
    console.log("Brand names:"+this.brands)
  }
}
