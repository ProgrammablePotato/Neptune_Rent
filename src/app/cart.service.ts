import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.getLoggedUser().subscribe(user => {
      if (user?.uid) {
        this.getUserId(user.uid)
      }
    })
  }

  private kotegeloApi = 'http://localhost:3000/buy/'
  private userApi = 'http://localhost:3000/users/firebase/'

  userId : string = ''
  userId$ = new BehaviorSubject<string>('')

  getCart(id:number) {
    return this.http.get(this.kotegeloApi+"/user/"+id)
  }

  buyProduct(productId: number, data: any) {
    return this.http.post(this.kotegeloApi, {
      user_id: this.userId,
      details: [
        { product_id: productId, quantity: data.quantity }
      ]
    })
  }

  addToCart(id:number, productId:any) {
    return this.http.post(this.kotegeloApi + id, { productId })
  }

  getUserId(firebase_uid: string) {
    if (!firebase_uid) {
      console.error('Firebase UID is undefined')
      return
    }
    this.http.get<{ id: string }>(this.userApi + firebase_uid).subscribe({
      next: (response) => {
        this.userId = response.id
        this.userId$.next(response.id)
      },
      error: (error) => {
        console.error('Error fetching user ID:', error)
      }
    })
  }

  submitReview(data: { product_id: number, user_id: string, rating: number, reviewText: string }) {
    if (!this.userId) {
      console.error('User ID not available. Cannot submit review.')
      return
    }
    return this.http.post(`http://localhost:3000/review/${this.userId}`, data)
  }

  getReviewsByProductId(productId: number) {
    return this.http.get(`http://localhost:3000/review/byProdId/${productId}`)
  }

  removeItem(productId: number) {
    return this.http.delete(this.kotegeloApi + productId)
  }
}
