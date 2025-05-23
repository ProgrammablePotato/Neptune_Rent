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
    const url = `${this.apiUrl}/products/${id}`
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
  getUsers() {
    this.http.get(`${this.apiUrl}/users`).subscribe((users:any) => {
      this.users = users
      console.log("Users: ",this.users)
    })
  }
  deleteUser(uid:string) {
    return this.http.delete(`${this.apiUrl}/users/${uid}`)
  }
  getUserDetails(firebase_uid:string) {
    let api = `${this.apiUrl}/users/firebase/${firebase_uid}`
    if (!firebase_uid) {
      console.error('Firebase UID is undefined')
      return
    }
    return this.http.get<{ id: string }>(api)
  }
  getLatestImageForCategory(cat:string) {
    return this.http.get(`${this.apiUrl}/products/catimg/${cat}`)
  }

  uploadImage(file: any,id:number) {
    const formData = new FormData()
    formData.append('image', file)
    return this.http.post<{ imageUrl: string }>(this.apiUrl+'/upload/'+id, formData)
  }
  getImage(filename:string) {
    return this.http.get(`${this.apiUrl}/upload/${filename}`)
  }
  deleteImage(filename:string) {
    return this.http.delete(`${this.apiUrl}/upload/${filename}`)
  }
  getImages(){
    return this.http.get(`${this.apiUrl}/upload/`)
  }

  getImageUrl(filename: string): string {
    if (!filename || filename === 'no') {
      return `${this.apiUrl}/uploads/cat.jfif`
    }
    return `${this.apiUrl}/uploads/${filename}`
  }
}
