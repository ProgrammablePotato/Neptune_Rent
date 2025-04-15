import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RentService {

  private rentApi = 'http://localhost:3000/rent/'

  constructor(private http:HttpClient) { }

  getRent(id:number){
    return this.http.get(this.rentApi + "byId/" + id)
  }

  getRentByUserId(id:string){
    return this.http.get(this.rentApi + "byUserId/" + id)
  }

  rentProduct(user_id: number, product_id: number, price: number) {
    const body = {
      user_id,
      product_id,
      price
    }
    return this.http.post(this.rentApi, body)
  }
}
