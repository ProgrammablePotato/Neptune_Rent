import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { NewsService } from '../news.service';
import { SearchService } from '../search.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})
export class AccessoriesComponent {
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
  }

  filterBrand(brand:String) {
    this.filteredAccessories = []
    this.accessories.forEach((element:any) => {
      if (element.brand == brand) {
        this.filteredAccessories.push(element)
      }
    })
    this.hideDropdown()
    console.log(this.filteredAccessories)
  }
  resetFilter() {
    this.hideDropdown()
    this.filteredAccessories = this.accessories
  }
  hideDropdown() {
    document.getElementById('dropdown')?.classList.toggle('hidden')
  }
}