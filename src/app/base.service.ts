import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  currentPage = "/home"
  apiUrl = "http://localhost:3000"
  products:any = []
  users:any = []

  constructor (private auth:AuthService, private http:HttpClient) { }

  /*  PRODUCT-RELATED FUNCTIONS--------------------------------------------------
  *
  *   Get, Add, Update, Delete, etc.
  *
  *   ---------------------------------------------------------------------------
  */
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
  // getProductsByBrand(): Promise<any[]> {
  //   return new Promise((resolve) => {
  //     if (this.products.length > 0) {
  //       resolve(this.products)
  //     } else {
  //       this.http.get(`${this.apiUrl}/products/getBrand`).subscribe((prods: any) => {
  //         this.products = prods
  //         resolve(this.products)
  //       })
  //     }
  //   })
  // }
  getProductByCategoryAndId(cat: string, id: number) {
    return this.getProductsByCategory(cat).then((prods) => prods.find((prod) => prod.id === id))
  }
  addProduct(product:any) {
    const url = `${this.apiUrl}/products`
    return this.http.post(url,product)
  }
  editProduct(id:any,data:any) {
    const url = `${this.apiUrl}/products/${id}`
    console.log(url)
    return this.http.patch(url,data)
  }
  deleteProduct(id: number) {
    const url = `${this.apiUrl}/products/delete/${id}`
    return this.http.delete(url).pipe(
      tap(() => {
        this.getProducts().then(() => console.log("Updated"))
      })
    )
  }
  roundPrices() {
    for (let x = 0; x < this.products.length; x++) {
      this.products[x].price = (Math.round(this.products[x].price*100))/100
    }
  }
  /*  USER-RELATED FUNCTIONS--------------------------------------------------
  *
  *   Get, Add, Update, Delete, etc.
  *
  *   ---------------------------------------------------------------------------*/
  getUsers() {
    this.http.get(`${this.apiUrl}/users`).subscribe((users:any) => {
      this.users = users
      console.log("Users: ",this.users)
    })
  }
  deleteUser(uid:string) {
    return this.http.delete(`${this.apiUrl}/users/delUser/${uid}`)
  }
  /*  OTHER FUNCTIONS--------------------------------------------------
  *
  *   Get, Add, Update, Delete, etc.
  *
  *   ---------------------------------------------------------------------------*/
  generateRandomId(){
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
  }
}
