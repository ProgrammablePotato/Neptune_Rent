import { Component, NgModule, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NewsService } from '../news.service';
import { BaseService } from '../base.service';
import { ActivatedRoute, NavigationEnd, Router, RouteReuseStrategy } from '@angular/router';
import { SearchService } from '../search.service';
import { initFlowbite, initCarousels, initDropdowns } from 'flowbite';
import { AppComponent } from '../app.component';
import { dropdownCollapse, dropdownExtend } from '../app.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  public dropdownCollapse = dropdownCollapse
  public dropdownExtend = dropdownExtend
  activeNews:any
  nextNews:any

  categoryNews:any = []

  allProducts:any = []
  products:any[] = []
  filteredProducts:any = []

  category:string = ''
  searchTerm: string = ''
  brands:any[] = []

  constructor(private news:NewsService, private base:BaseService, private router:Router, private search:SearchService, private activated:ActivatedRoute){
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

  }
  ngOnInit() {
    this.base.currentPage = this.router.url
    this.category = String(this.activated.snapshot.paramMap.get('category'))
    console.log("category",this.category)
    this.getNews()
    this.getProducts()
    console.log(this.products)
  }
  async getNews() {
    await this.news.getTechNews(this.category).then((news:any) => {
      this.categoryNews = news
      console.log("Filtered news: ", news)
    }).catch((error:any) => {
      console.log("Nem jó")
    })
  }
  filterProducts() {
    this.filteredProducts = this.products.filter((product: any) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }
  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }
  async getProducts() {
    this.allProducts = await this.base.getProducts()
    this.base.roundPrices()
    this.filterCategory()
    this.filteredProducts = this.products
    this.getBrandNames()
  }
  filterCategory() {
    this.allProducts.forEach((product:any) => {
      if (product.category == this.category) {
        this.products.push(product)
      }
    })
  }
  filterBrand(brand:any) {
    if (brand == null) {
      this.filteredProducts = this.products
    } else {
      this.filteredProducts = []
      this.products.forEach((element:any) => {
        if (element.brand == brand) {
          this.filteredProducts.push(element)
        }
      })
    }
    dropdownCollapse('brand')
  }
  getNewsNumber(news:any) {
    return this.categoryNews.indexOf(news)
  }
  getBrandNames() {
    for (let i = 0; i < this.products.length; i++) {
      if (!this.brands.includes(this.products[i].brand)) {
        this.brands.push(this.products[i].brand)
      }
    }
    console.log("Brand names:"+this.brands)
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])});
  }
  sortByPrice(ascending:boolean) {
    let sorted = this.filteredProducts
    for (let x = 0; x < sorted.length; x++) {
      for (let y = 0; y < x; y++) {
        if (sorted[x-y].price < sorted[x-y-1].price) {
          let tmp = sorted[x-y]
          sorted[x-y] = sorted[x-y-1]
          sorted[x-y-1] = tmp
        }
      }
    }
    if (!ascending) sorted.reverse()
    this.filteredProducts = sorted
    this.dropdownCollapse("price")
  }
  getImagePath(file:string) {
    return "uploads/"+file
  }
}
