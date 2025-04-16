import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  email!:string
  password!:string

  user: any

  constructor(public auth:AuthService, private router:Router, private base:BaseService) {
    this.base.currentPage = this.router.url
    this.auth.getLoggedUser().subscribe(user => {
      this.user = user
      if (user) {
        this.router.navigate(['/home'])
      }
    })
  }

  login() {
    if (!this.email || !this.password) {
      console.error("Nincs megadva e-mail vagy jelszó!")
      return;
    }
    this.auth.loginUser(this.email, this.password)
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle()
      .finally(() => this.router.navigate(['/home']))
      .catch(err => console.error("Hiba történt!", err.message))
  }

  forgotPassword(){
    this.auth.forgotPassword(this.email)
  }

}
