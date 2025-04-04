import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../base.service';
import { from } from 'rxjs';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';

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
  rating: number = 5
  reviewSent: boolean = false
  reviews: any[] = []

  constructor(
    private activeRouter: ActivatedRoute, private base: BaseService, private cart: CartService, private auth:AuthService) {}

  ngOnInit(): void {
    const category = this.activeRouter.snapshot.paramMap.get('category')
    const productId = Number(this.activeRouter.snapshot.paramMap.get('id'))

    if (category && !isNaN(productId)) {
      from(this.base.getProductByCategoryAndId(category, productId)).subscribe({
        next: (data) => {
          this.product = data
          this.loading = false
          this.base.roundPrices()
        },
        error: (error) => {
          this.error = 'Hiba történt a termék betöltésekor!'
          console.error(error)
          this.loading = false
        },
        complete: () => {
          console.log('Product loaded!')
        }
      })
    } else {
      this.error = 'Érvénytelen termékadat!'
      this.loading = false
    }

    this.loadReviews()
  }

  loadReviews() {
    this.cart.getReviewsByProductId(this.product?.id).subscribe({
      next: (res) => {
        this.reviews = res as any[]
      },
      error: (err) => console.error(err)
    })
  }

  addToCart() {
    this.cart.buyProduct(this.product.id, { quantity: this.quantity }).subscribe({
      next: (response) => {
        console.log('Termék hozzáadva a kosárhoz:', response)
      },
      error: (error) => {
        console.error('Hiba történt a termék hozzáadásakor:', error)
      }
    })
  }

  submitReview() {
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
          console.error('Hiba az értékelés elküldésekor:', err)
        }
      })
    } else {
      console.warn('submitReview hívás nem történt meg, mert a userId nem volt elérhető.')
    }
  }
}
