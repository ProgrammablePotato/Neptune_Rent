import { Component, OnInit} from '@angular/core';
import { CartService } from '../cart.service';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private cartService: CartService, private activeRouter: ActivatedRoute) {}

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
    this.cartItems.forEach((item:any) => {
      this.totalPrice += item.price * item.quantity
    })
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
