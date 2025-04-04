import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

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

  private cartApi = 'http://localhost:3000/cart/'
  private kotegeloApi = 'http://localhost:3000/buy/'
  private userApi = 'http://localhost:3000/users/firebase/'

  userId : string = ''

  getCart(id:number) {
    return this.http.get(this.cartApi+'test/'+id)
  }

  buyProduct(id:number, productId:any) {
    return this.http.post(this.kotegeloApi + id, { productId }), this.addToCart(id, productId)
  }

  addToCart(id:number, productId:any) {
    return this.http.post(this.cartApi + id, { productId })
  }

  getUserId(firebase_uid: string) {
    if (!firebase_uid) {
      console.error('Firebase UID is undefined')
      return
    }
    this.http.get<{ id: string }>(this.userApi + firebase_uid).subscribe({
      next: (response) => {
        this.userId = response.id
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
}
