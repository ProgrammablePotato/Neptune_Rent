import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  currentPage = "/home"
  apiUrl = "http://localhost:3000"
  products:any = []
  users:any = []

  constructor (private auth:AuthService, private http:HttpClient) {
    this.getProducts()
    this.getProduct(1)
    this.getUsers()
    this.getUser(1)
  }

  getProducts() {
    this.http.get(`${this.apiUrl}/products`).subscribe((prods:any) => {
      this.products = prods
      console.log("Products: ",this.products)
    })
  }

  getUsers() {
    this.http.get(`${this.apiUrl}/users`).subscribe((users:any) => {
      this.users = users
      console.log("Users: ",this.users)
    })
  }

  getProduct(id:number) {
    this.http.get(`${this.apiUrl}/products/${id}`).subscribe((prod:any) => {
      console.log("Product: ",prod)
      return prod
    })
  }

  getProductsByCategory(cat:String) {
    let categorised:any = []
    console.log("Catcucc: ",this.products)
    this.products.forEach((prod:any) => {
      if (prod.category == cat) {
        // sql returns erroneous number values due to prices being
        // stored in float datatype, hence the line below
        prod.price = (Math.round(prod.price*100))/100
        categorised.push(prod)
      }
    
    })
    return categorised;
  }

  getUser(id:number) {
    //ezt nemtom még mert postos
  }
}
