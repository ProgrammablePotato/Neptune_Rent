import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  constructor(private http:HttpClient, private auth:AuthService) { }

  private cartApi = 'http://localhost:3000/cart'

  
}
