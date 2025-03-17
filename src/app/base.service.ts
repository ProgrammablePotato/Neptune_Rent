import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  currentPage = "/home"
  productsUrl = "http://localhost:3000/products/"
  products:any = []

  constructor (private auth:AuthService, private http:HttpClient) {
    // this.getProducts().subscribe((data:any)=>{
    //   this.products = data
    // })
    this.products = this.renderProducts()
    console.log(this.products)
  }
  getProducts() {
    return this.http.get(this.productsUrl)
  }
  renderProducts() {
    this.getProducts().subscribe((prods:any) => {
      console.log(prods)
      for () {
        
      }
    }) 
  }
}
