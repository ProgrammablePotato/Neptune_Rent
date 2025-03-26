import { Component, OnInit} from '@angular/core';
import { CartService } from '../cart.service';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../base.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartId:any
  product: any[] = []
  price: number = 0
  quantity: number = 0
  totalPrice: number = 0

  constructor(private cartService: CartService, private base:BaseService, private activeRouter: ActivatedRoute) {}

  getCart(){
    this.cartService.getCart(this.cartId).subscribe((data:any) => {
      console.log("cucc", data)
      this.product = data
      this.price = Number.parseFloat(data.price)
      this.quantity = data.quantity
      this.totalPrice = this.price * this.quantity
    })
  }

  ngOnInit(): void {
    this.cartId = this.activeRouter.snapshot.paramMap.get('id')
    this.getCart()
  }
}
