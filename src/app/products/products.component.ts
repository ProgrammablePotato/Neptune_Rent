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
  activeNews:any = null
  nextNews:any

  categoryNews:any = []

  allProducts:any = []
  products:any[] = []
  filteredProducts:any = []

  category:string = ''
  searchTerm: string = ''
  brands:any[] = []
  currentBrand:string = "All brands"
  currentPriceFiltering:string = "Sort by price"

  currentNews = 0

  constructor(private news:NewsService, private base:BaseService, private router:Router, private search:SearchService, private activated:ActivatedRoute){
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  ngOnInit() {
    this.base.currentPage = this.router.url
    this.category = String(this.activated.snapshot.paramMap.get('category'))
    console.log("category",this.category)
    this.getNews()
    this.getProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    console.log(this.products)
  }

  async getNews() {
    await this.news.getTechNews(this.category).then((news:any) => {
      this.categoryNews = news
      console.log("Filtered news: ", news)
      this.activeNews = this.categoryNews[0]
      this.carouselHandler()
    }).catch((error:any) => {
      console.log("Not good")
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
      this.currentBrand = "All brands"
      this.filteredProducts = this.products
    } else {
      this.currentBrand = "Brand: "+brand
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
    this.currentPriceFiltering = "Smallest price first"
    if (!ascending) {
      this.currentPriceFiltering = "Highest price first"
      sorted.reverse()
    }
    this.filteredProducts = sorted
    this.dropdownCollapse("price")
  }

  getImagePath(file:string) {
    return "uploads/"+file
  }
  carouselHandler() {
    
    setInterval(() => {
        if (this.activeNews != null) {
      this.carouselStep(true)
    }
    }, 5000);
  }
  carouselStep(forward:boolean) {
    if (forward) {
      this.currentNews++
      if (this.currentNews > this.categoryNews.length-1) {
        this.currentNews = 0
      }
    }
    else {
      this.currentNews--
      if (this.currentNews < 0) {
        this.currentNews = this.categoryNews.length-1
      }
    }
    
    this.activeNews = this.categoryNews[this.currentNews]
  }

  openNews(url: string) {
    window.open(url, '_blank')
  }
}
