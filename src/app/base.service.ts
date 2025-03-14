import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  currentPage = "/home"
  currentLanguage = 0

  prodApi = "https://neptune-rent-default-rtdb.firebaseio.com/"
  products:any = []

  constructor(private http:HttpClient) {
    this.getProducts().subscribe((data:any)=>{
      this.products = data
    })
  }

  getProductByCategoryAndId(category: string, id: number) {
    const ccategory = category
    const url = `${this.prodApi}${ccategory}/${id}.json`
    console.log(url)
    return this.http.get(url);
  }

  getProducts(): Observable<any> {
    return this.http.get<{ [key: string]: any }>(`${this.prodApi}.json`).pipe(
      map(response => {
        const products: { [category: string]: any[] } = {};
        for (const category in response) {
          products[category] = Object.keys(response[category]).map(key => ({
            id: key,
            ...response[category][key]
          }));
        }
        return products;
      })
    );
  }


  editProducts(id:any, data:any, category:any){
    const ccategory = category
    const url = `${this.prodApi}${ccategory}/${id}.json`
    console.log(url)
    return this.http.patch(url,data)
  }

  addProduct(category: string, data: any) {
    return this.http.post(`${this.prodApi}${category}.json`, data)
  }

  generateCartToken(){
    const token = crypto.randomUUID()
    return console.log(token)
  }

  deleteProduct(category: string, id: number) {
    const url = `${this.prodApi}${category}/${id}.json`
    return this.http.delete(url)
  }
}
