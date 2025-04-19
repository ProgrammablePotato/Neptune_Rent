import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  email!:string
  password!:string
  user: any
  loginError: string = ''
  successMessage: string = ''

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
      this.loginError = "Please enter both email and password"
      return;
    }
    this.loginError = ''
    this.auth.loginUser(this.email, this.password).catch(error => {
      if (error.code === 'auth/email-not-verified') {
        this.loginError = "Please verify your email address first"
      } else {
        this.loginError = "Invalid email or password"
      }
    })
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle()
      .finally(() => this.router.navigate(['/home']))
      .catch(err => console.error("Hiba történt!", err.message))
  }

  forgotPassword(){
    this.auth.forgotPassword(this.email)
  }

  resendVerificationEmail() {
    this.auth.resendVerificationEmail()
    this.successMessage = "Verification email has been sent! Please check your inbox."
    this.loginError = ''
    setTimeout(() => {
      this.successMessage = ''
    }, 5000)
  }

}
