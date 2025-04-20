import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = 'http://localhost:3000/coupons'

  constructor(private http: HttpClient) { }

  getAllCoupons(): Observable<any> {
    return this.http.get(`${this.apiUrl}`)
  }

  createCoupon(code: string, discount: number, expiryDate: Date | null, isActive: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      code,
      discount,
      expiryDate,
      isActive
    })
  }

  updateCoupon(id: number, code: string, discount: number, expiryDate: Date | null, isActive: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      code,
      discount,
      expiryDate,
      isActive
    })
  }

  deleteCoupon(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  validateCoupon(code: string, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, {
      code,
      userId
    })
  }

  useCoupon(code: string, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/use`, {
      code,
      userId
    })
  }

  getUsedCoupons(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/used/${userId}`)
  }
}
