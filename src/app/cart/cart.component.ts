import { Component, OnInit} from '@angular/core';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartId:any
  cartItems: any[] = []
  totalPrice: number = 0

  constructor(private cartService: CartService, private auth:AuthService, private activeRouter: ActivatedRoute) {}

  getCart() {
    this.cartService.getCart(this.cartId).subscribe((data: any) => {
      try {
        if (data.length > 0 && data[0].contents) {
          const parsedContents = JSON.parse(data[0].contents.replace(/'/g, '"'))
          this.cartItems = Object.entries(parsedContents).map(([productId, quantity]) => ({
            id: productId,
            quantity: quantity,
            price: this.totalPrice
          }))
        } else {
          this.cartItems = []
        }
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      } catch (error) {
        console.error('Hiba a kosár adatainak feldolgozásakor:', error)
        this.cartItems = []
      }
    })
  }

  ngOnInit(): void {
    this.cartId = this.activeRouter.snapshot.paramMap.get('id')
    this.getCart()
  }
}
