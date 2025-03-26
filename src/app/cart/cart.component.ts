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

  constructor(private cartService: CartService, private auth:AuthService, private activeRouter: ActivatedRoute) {}

  getCart() {
    
  }
  ngOnInit(): void {
    this.cartId = this.activeRouter.snapshot.paramMap.get('id')
    console.log(this.cartId)
    this.cartService.getCart(this.cartId).subscribe((data) => {
      console.log("Cart contents:",data)
    })
  }
}
