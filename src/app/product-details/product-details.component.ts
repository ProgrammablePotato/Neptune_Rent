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
  showRentalModal: boolean = false
  today: string = new Date().toISOString().split('T')[0]
  startDate: string = this.today
  endDate: string = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  rentalPrice: number = 0
  deposit: number = 0
  totalPrice: number = 0

  constructor(
    private activeRouter: ActivatedRoute, private http:HttpClient, private base: BaseService, 
    private cart: CartService, private auth:AuthService, private rentservice:RentService) {
    const today = new Date()
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    this.endDate = nextMonth.toISOString().split('T')[0]
  }

    private userApi = 'http://127.0.0.1:3000/users/firebase/'
    userId : any = ''
    userId$ = new BehaviorSubject<string>('')

    ngOnInit(): void {
      this.categoryChecker()
      this.idGetterFix()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    idGetterFix(){
      setTimeout(() => {
        if (this.auth.loggedUser?.uid) {
          this.getUserId(this.auth.loggedUser.uid)
        }
      }, 10)
      const checkUserInterval = setInterval(() => {
        if (this.auth.loggedUser?.uid) {
          clearInterval(checkUserInterval)
          this.loggedUser = this.auth.loggedUser
          this.getUserId(this.auth.loggedUser.uid)
        }
      }, 10)
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
            this.loadReviews()
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
      return console.error('No Firebase UID found.')
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

  calculateRentalPrice() {
    const start = new Date(this.startDate)
    const end = new Date(this.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    this.rentalPrice = Math.round((this.product.price * 0.1) * days)
    this.deposit = this.product.price
    this.totalPrice = this.rentalPrice + this.deposit
  }

  onDateChange() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate)
      const end = new Date(this.endDate)
      
      if (start > end) {
        this.endDate = new Date(start.setMonth(start.getMonth() + 1)).toISOString().split('T')[0]
      }
      this.calculateRentalPrice()
    }
  }

  rent() {
    if (!this.userId || !this.product) return
    
    const rentalData = {
      user_id: this.userId,
      product_id: this.product.id,
      start_date: new Date(this.startDate),
      expires: new Date(this.endDate),
      price: this.totalPrice
    }

    if (!rentalData.price) {
      console.error('Missing price value')
      return
    }

    this.rentservice.rentProduct(rentalData).subscribe({
      next: (res) => {
        console.log("Successful rent:", res)
        this.successMessage = true
        this.showRentalModal = false
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

  openRentalModal() {
    this.showRentalModal = true
    this.calculateRentalPrice()
  }
}
