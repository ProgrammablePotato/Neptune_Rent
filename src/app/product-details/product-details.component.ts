import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../base.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product : any = null
  loading : boolean = true
  error : string | null = null

  constructor(private activeRouter:ActivatedRoute, private  base:BaseService) { }

  ngOnInit(): void {
    const category = this.activeRouter.snapshot.paramMap.get('category')
    const productId = Number(this.activeRouter.snapshot.paramMap.get('id'))

    if (category && !isNaN(productId)) {
      from(this.base.getProductByCategoryAndId(category, productId))
        .subscribe({
          next: (data) => {
            this.product = data
            this.loading = false
          },
          error: (error) => {
            this.error = 'Error!', error
            this.loading = false;
          },
          complete: () => {
            console.log('Product loaded!')
          }
        })
    } else {
      this.error = 'Invalid product datas!'
      this.loading = false
    }
  }
}
