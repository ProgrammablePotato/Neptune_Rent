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

  constructor(private cartService: CartService, private activeRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.cartId = this.activeRouter.snapshot.paramMap.get('id')
    if (this.cartId) {
      this.cartId = this.cartId
      this.loadCart(this.cartId)
    }
  }

  loadCart(id: number): void {
    this.cartService.getCart(id).subscribe((data: any) => {
      this.cartItems = data
      this.calculateTotal()
    })
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}
