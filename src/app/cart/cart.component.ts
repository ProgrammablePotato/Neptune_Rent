import { Component, Input, input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  uid?:string | null = null

  constructor(private base:BaseService, private route:ActivatedRoute){}

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get('id')
    this.route.params.subscribe(
      (params) =>{
        this.uid = params['id']
      }
    )
  }

  getToken(){
    this.base.generateCartToken()
  }
}
