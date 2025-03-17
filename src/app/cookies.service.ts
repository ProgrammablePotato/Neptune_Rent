import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  private cookieName = 'recentProducts'
  private maxProducts = 5

  constructor(private cookie:CookieService) {}

  getRecentProducts(): string[] {
    const cookie = this.cookie.get(this.cookieName)
    return cookie ? JSON.parse(cookie) : []
  }

  saveRecentProduct(productId: string) {
    let recentProducts = this.getRecentProducts()
    recentProducts = recentProducts.filter(id => id !== productId)
    recentProducts.unshift(productId)
    if (recentProducts.length > this.maxProducts) {
      recentProducts.pop()
    }
    this.cookie.set(this.cookieName, JSON.stringify(recentProducts), 7, '/')
  }
}
