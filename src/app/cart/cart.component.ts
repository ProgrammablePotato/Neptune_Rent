import { Component, OnInit} from '@angular/core';
import { CartService } from '../cart.service';
import { ActivatedRoute } from '@angular/router';
import { CouponService } from '../coupon.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartId: any
  cartItems: any[] = []
  totalPrice: number = 0
  successMessage: boolean = false
  couponCode: string = ''
  appliedCoupon: any = null
  couponError: string = ''

  constructor(
    private cartService: CartService, 
    private activeRouter: ActivatedRoute,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.cartId = Number(this.activeRouter.snapshot.paramMap.get('id'))
    if (this.cartId) {
      this.loadCart(this.cartId)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  loadCart(id: number): void {
    this.cartService.getCart(id).subscribe((data: any) => {
      this.cartItems = data
      this.calculateTotal()
    })
  }

  calculateTotal(): void {
    this.totalPrice = 0
    this.cartItems.forEach((item:any) => {
      this.totalPrice += item.price * item.quantity
    })
  }

  calculateDiscount(): number {
    if (!this.appliedCoupon) return 0
    return (this.totalPrice * this.appliedCoupon.discount) / 100
  }

  calculateFinalPrice(): number {
    return this.totalPrice - this.calculateDiscount()
  }

  formatDiscount(discount: number): string {
    return `${discount}%`
  }

  applyCoupon(): void {
    if (!this.couponCode) {
      this.couponError = 'Please enter a coupon code'
      return
    }

    this.couponService.validateCoupon(this.couponCode, this.cartId).subscribe({
      next: (coupon) => {
        this.appliedCoupon = coupon
        this.couponError = ''
        this.couponCode = ''
      },
      error: (error) => {
        this.couponError = error.error.error || 'Invalid coupon code'
        this.appliedCoupon = null
      }
    })
  }

  removeCoupon(): void {
    this.appliedCoupon = null
    this.couponError = ''
  }

  removeFromCart(cartItemId: number): void {
    this.cartService.removeItem(cartItemId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== cartItemId)
      this.calculateTotal()
    })
  }

  checkout(){
    this.successMessage = true
    setTimeout(() => {
      this.successMessage = false
    }, 6000)
  }
}
