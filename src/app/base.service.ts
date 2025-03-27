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
    this.getUsers()
  }

  getProducts(): Promise<any[]> {
    return new Promise((resolve) => 
    {
      if (this.products.length > 0) {
        resolve(this.products)
      } else {
        this.http.get(`${this.apiUrl}/products`).subscribe((prods:any) => {
          this.products = prods
          this.roundPrices()
          resolve(this.products)
        })
      }
    })
  }

  getUsers() {
    this.http.get(`${this.apiUrl}/users`).subscribe((users:any) => {
      this.users = users
      console.log("Users: ",this.users)
    })
  }

  getProductsByCategory(cat: string): Promise<any[]> {
    return new Promise((resolve) => {
      if (this.products.length > 0) {
        resolve(this.products.filter((prod: any) => prod.category === cat))
      } else {
        this.http.get(`${this.apiUrl}/products`).subscribe((prods: any) => {
          this.products = prods
          resolve(this.products.filter((prod:any) => prod.category === cat))
        })
      }
    })
  }

  getProductsByBrand(): Promise<any[]> {
    return new Promise((resolve) => {
      if (this.products.length > 0) {
        resolve(this.products)
      } else {
        this.http.get(`${this.apiUrl}/products/getBrand`).subscribe((prods: any) => {
          this.products = prods
          resolve(this.products)
        })
      }
    })
  }

  getProdByBrand(){
    return this.http.get(`${this.apiUrl}/products/getBrand`)
  }

  getProductByCategoryAndId(cat: string, id: number) {
    return this.getProductsByCategory(cat).then((prods) => prods.find((prod) => prod.id === id))
  }

  generateRandomId(){
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
  }

  roundPrices() {
    for (let x = 0; x < this.products.length; x++) {
      this.products[x].price = (Math.round(this.products[x].price*100))/100
    }
  }

  editProduct(id:any,data:any) {
    const url = `${this.apiUrl}/products/${id}`
    console.log(url)
    return this.http.patch(url,data)
  }

  deleteProduct(id:any) {
    const url = `${this.apiUrl}/products/delete/${id}`
    console.log(url)
    return this.http.delete(url)
  }
}
