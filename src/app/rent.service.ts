import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

interface RentalData {
  user_id: number;
  product_id: number;
  start_date: Date;
  expires: Date;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class RentService {

  private rentApi = 'http://localhost:3000/rent'

  constructor(private http:HttpClient) { }

  getRent(id:number){
    return this.http.get(this.rentApi + "/byId/" + id)
  }

  getRentByUserId(id:string){
    return this.http.get(this.rentApi + "/byUserId/" + id)
  }

  rentProduct(rentalData: RentalData) {
    return this.http.post(this.rentApi, rentalData)
  }

  async deleteRental(rentalId: string): Promise<void> {
    const url = `${this.rentApi}/${rentalId}`
    await lastValueFrom(this.http.delete(url))
  }

  async updateRental(rentalId: string, rentalData: any): Promise<any> {
    const url = `${this.rentApi}/${rentalId}`
    return await lastValueFrom(this.http.patch(url, rentalData))
  }
}
