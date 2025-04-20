import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../base.service';
import { BehaviorSubject, from } from 'rxjs';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { RentService } from '../rent.service';
import { HttpClient } from '@angular/common/http';
import { CookiesService } from '../cookies.service';

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
  startDate: string = ''
  endDate: string = ''
  rentalPrice: number = 0
  deposit: number = 0
  totalPrice: number = 0
  showNotification = false
  notificationType: 'error' | 'success' = 'error'
  notificationMessage = ''
  isNotificationHiding = false
  showQuantityModal = false
  selectedQuantity = 1
  totalCartPrice = 0

  constructor(
    private activeRouter: ActivatedRoute, private http:HttpClient, private base: BaseService, 
    private cart: CartService, private auth:AuthService, private rentservice:RentService,
    private cookies: CookiesService
  ) {}

    private userApi = 'http://127.0.0.1:3000/users/firebase/'
    userId : any = ''
    userId$ = new BehaviorSubject<string>('')

    ngOnInit(): void {
      this.categoryChecker()
      this.idGetterFix()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.activeRouter.params.subscribe(params => {
        const category = params['category']
        const id = +params['id']
        this.base.getProductByCategoryAndId(category, id).then(product => {
          this.product = product
          if (product) {
            this.cookies.saveRecentProduct(product.id.toString())
          }
        })
      })
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
        this.reviews = Array.isArray(res) ? res : []
        console.log("reviews loaded:", this.reviews)
      },
      error: (err) => {
        console.error("Error loading reviews:", err)
        this.reviews = []
      }
    })
  }

  addToCart() {
    this.showQuantityModal = true;
    this.selectedQuantity = 1;
    this.calculateTotalPrice();
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

  onDateChange() {
    if (this.startDate) {
      const start = new Date(this.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (start < today) {
        this.startDate = ''
        return
      }
    }
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate)
      const end = new Date(this.endDate)
      
      if (end < start) {
        this.endDate = ''
        return
      }
    }
    
    this.calculateRentalPrice()
  }

  calculateRentalPrice() {
    if (!this.product || !this.startDate || !this.endDate) {
      this.rentalPrice = 0
      this.deposit = 0
      this.totalPrice = 0
      return
    }
    
    const start = new Date(this.startDate)
    const end = new Date(this.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    this.rentalPrice = Math.round((this.product.price * 0.1) * days)
    this.deposit = this.product.price
    this.totalPrice = this.rentalPrice + this.deposit
  }

  isRentableCategory(): boolean {
    const rentableCategories = ['pcs', 'servers', 'laptops']
    return this.product && rentableCategories.includes(this.product.category)
  }

  showNotificationMessage(message: string, type: 'error' | 'success' = 'error') {
    this.notificationMessage = message
    this.notificationType = type
    this.showNotification = true
    this.isNotificationHiding = false

    setTimeout(() => {
      this.hideNotification()
    }, 3000)
  }

  hideNotification() {
    this.isNotificationHiding = true
    setTimeout(() => {
      this.showNotification = false
      this.isNotificationHiding = false
    }, 300)
  }

  rent() {
    if (!this.userId || !this.product || !this.isRentableCategory()) {
      this.showNotificationMessage("You must be logged in to rent a product!")
      return
    }

    if (!this.startDate || !this.endDate) {
      this.showNotificationMessage("Please select both start and end dates!")
      return
    }

    const start = new Date(this.startDate)
    const end = new Date(this.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      this.showNotificationMessage("Start date cannot be in the past!")
      return
    }

    if (end <= start) {
      this.showNotificationMessage("End date must be after start date!")
      return
    }
    
    const rentalData = {
      user_id: this.userId,
      product_id: this.product.id,
      start_date: start,
      expires: end,
      price: this.totalPrice
    }

    this.rentservice.rentProduct(rentalData).subscribe({
      next: (res) => {
        console.log("Successful rent:", res)
        this.showNotificationMessage("Rental successful!", 'success')
        this.showRentalModal = false
      },
      error: (err) => {
        console.error("Error:", err)
        this.showNotificationMessage("Error occurred while processing your rental request!")
      }
    })
  }

  openRentalModal() {
    this.showRentalModal = true
    this.calculateRentalPrice()
  }

  openQuantityModal() {
    this.showQuantityModal = true
    this.calculateTotalPrice()
  }

  closeQuantityModal() {
    this.showQuantityModal = false
    this.selectedQuantity = 1
  }

  calculateTotalPrice() {
    this.totalCartPrice = this.product.price * this.selectedQuantity
  }

  onQuantityChange() {
    this.calculateTotalPrice()
  }

  addToCartWithQuantity() {
    this.cart.buyProduct(this.product.id, { quantity: this.selectedQuantity }).subscribe({
      next: (response) => {
        console.log('Item added to cart:', response)
        this.showNotificationMessage("Item added to cart successfully!", 'success')
        this.closeQuantityModal()
      },
      error: (error) => {
        console.error('Error while adding item to cart:', error)
        this.showNotificationMessage("Error occurred while adding item to cart!")
      }
    })
  }
}
