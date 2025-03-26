import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { NewsService } from '../news.service';
import { SearchService } from '../search.service';
import { initFlowbite } from 'flowbite';
import { min } from 'rxjs';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})
export class AccessoriesComponent {
  priceRanges:number[] = [0,0,0,0]

  accessories: any = []
  filteredAccessories: any = []

  accNews: any[] = []
  searchTerm: string = ''
  brands: String[] = []

  constructor(private base: BaseService, private router: Router, private news: NewsService, private search:SearchService) {
    this.base.currentPage = this.router.url
    this.getAccessories()
    this.getNews()
    // this.getProductsByBrand()
  }

  // getProductsByBrand() {
  //   this.base.getProdByBrand().subscribe((data) => {
  //     this.brands = data as any[]
  //     console.log("Brand: ", this.brands)
  //   })
  // }

  getBrandNames() {
    for (let i = 0; i < this.accessories.length; i++) {
      if (!this.brands.includes(this.accessories[i].brand)) {
        this.brands.push(this.accessories[i].brand)
      }
    }
    console.log("Brand names:"+this.brands)
  }

  async getNews(){
    await this.news.getAccessNews().subscribe((data) => {
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
    console.log("Accessories: ", this.accessories)
    this.base.roundPrices()
    this.filteredAccessories = this.accessories
    this.getBrandNames()
    this.getPrices()
  }

  filterBrand(brand:String) {
    this.hideDropdown()
    this.filteredAccessories = []
    this.accessories.forEach((element:any) => {
      if (element.brand == brand) {
        this.filteredAccessories.push(element)
      }
    });
    console.log(this.filteredAccessories)
  }
  resetFilter() {
    this.hideDropdown()
    this.filteredAccessories = this.accessories
  }
  hideDropdown() {
    let dropdown = document.getElementById("dropdown")
    console.log(dropdown?.getAttribute("aria-hidden"))
    dropdown?.setAttribute("aria-hidden","false")
  }
  getPrices() {
    var prices:number[] = []
    this.filteredAccessories.forEach((element:any) => {
      prices.push(element.price)
    });
    this.priceRanges[0] = Math.min(...prices)
    this.priceRanges[3] = Math.max(...prices)
    this.priceRanges[1] = this.priceRanges[0]+((this.priceRanges[3]-this.priceRanges[0])*0.33)
    this.priceRanges[1] = (Math.round(this.priceRanges[1]*100))/100
    this.priceRanges[2] = this.priceRanges[0]+((this.priceRanges[3]-this.priceRanges[0])*0.66)
    this.priceRanges[2] = (Math.round(this.priceRanges[2]*100))/100
    console.log(this.priceRanges)
  }
  getPriceRanges(index:number) {
    return this.priceRanges[index]
  }
}
