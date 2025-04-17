import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../base.service';
import { BehaviorSubject, from } from 'rxjs';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { RentService } from '../rent.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: any = null
  loading: boolean = true
  error: string | null = null
  quantity: number = 1
  reviewText: string = ''
  rating: number = 0
  reviewSent: boolean = false
  reviews: any[] = []
  category: string | null = null
  successMessage: boolean = false
  addSuccess: boolean = false
  addError: boolean = false
  loggedUser: any = null

  constructor(
    private activeRouter: ActivatedRoute, private http:HttpClient, private base: BaseService, 
    private cart: CartService, private auth:AuthService, private rentservice:RentService) {}

    private userApi = 'http://localhost:3000/users/firebase/'
    userId : any = ''
    userId$ = new BehaviorSubject<string>('')

    ngOnInit(): void {
      this.categoryChecker()
      this.loadReviews()
      this.getUserId(this.auth.loggedUser?.uid)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    categoryChecker(){
      this.category = this.activeRouter.snapshot.paramMap.get('category')
      const productId = Number(this.activeRouter.snapshot.paramMap.get('id'))
      if (this.category && !isNaN(productId)) {
        from(this.base.getProductByCategoryAndId(this.category, productId)).subscribe({
          next: (data) => {
            this.product = data
            this.loading = false
            this.base.roundPrices()
          },
          error: (error) => {
            this.error = 'Error!'
            console.error(error)
            this.loading = false
          },
          complete: () => {
            console.log('Product loaded!')
          }
        })
      } else {
        this.error = 'Invalid product data!'
        this.loading = false
      }
    }

  loadReviews() {
    this.cart.getReviewsByProductId(this.product?.id).subscribe({
      next: (res) => {
        this.reviews = res as any[]
        console.log("reviews loaded")
      },
      error: (err) => console.error(err)
    })
  }

  addToCart() {
    this.cart.buyProduct(this.product.id, { quantity: this.quantity }).subscribe({
      next: (response) => {
        console.log('Item added to cart:', response)
        this.addSuccess = true
        setTimeout(() => {
          this.addSuccess = false
        }, 3000)
      },
      error: (error) => {
        console.error('Error while adding item to cart:', error)
        this.addError = true
        setTimeout(() => {
          this.addError = false
        }, 3000)
      }
    })
  }

  submitReview() {
    if (this.rating == 0) {
      alert("Please use the stars to rate the product!")
      return
    }
    const user_id = this.auth.loggedUser?.uid
    if (!user_id || !this.product) return
    const reviewRequest = this.cart.submitReview({
      product_id: this.product.id,
      user_id,
      rating: this.rating,
      reviewText: this.reviewText
    })
    if (reviewRequest) {
      reviewRequest.subscribe({
        next: () => {
          this.reviewSent = true
          this.reviewText = ''
          this.loadReviews()
        },
        error: (err) => {
          console.error('Error while submitting review:', err)
        }
      })
    } else {
      console.warn('No UID found.')
    }
  }

  rateProduct(rating:number) {
    for (let y = 1; y < 6; y++) {
      var star = document.getElementById("rate-star-"+(y))
      star?.setAttribute("fill","none")
    }
    this.rating = rating
    for (let x = 1; x <= rating; x++) {
      var star = document.getElementById("rate-star-"+(x))
      star?.setAttribute("fill","yellow")
    }
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

  rent() {
    const userId = this.userId
    if (!userId || !this.product) return
    const price = this.product.price
    this.rentservice.rentProduct(userId, this.product.id, price).subscribe({
      next: (res) => {
        console.log("Successful rent:", res)
        this.successMessage = true
        setTimeout(() => {
          this.successMessage = false
        }, 4000)
      },
      error: (err) => {
        console.error("Error:", err)
        this.addError = true
        setTimeout(() => {
          this.addError = false
        }, 3000)
      }
    })
  }
}
