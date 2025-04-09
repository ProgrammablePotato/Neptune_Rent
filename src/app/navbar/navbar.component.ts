import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navbarHidden = false
  loggedUser:any=null
  sub?:Subscription
  points:any = []
  public words:any
  isAdmin:boolean=false

  constructor(private auth:AuthService, private router:Router, public base:BaseService){
    this.setMenuWords()
  }

  ngOnInit(): void {
    this.sub = this.auth.getCurrentUser().subscribe(
      (user) => {
        this.loggedUser = user
        this.auth.getIsAdmin().subscribe((isAdmin) => {
          this.isAdmin = isAdmin
        })
      }
    );
    this.isSmall()
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()

  }

  logout(){
    console.log("Kilép")
    if (this.loggedUser) this.auth.logout()
  }

  setCurrentPage(page:string) {
    this.base.currentPage = "/"+page
  }
  isCurrent(page:string) {
    if (this.base.currentPage === "/"+page) {
      if (page === "admin") {
        return 'active-admin'
      }
      return 'active-link'
    } return 'inactive-link'
  }
  hideShow() {
    var navbar = <HTMLDivElement>document.getElementById('neptune-navbar')
    this.navbarHidden ? navbar.style.display = "none" : navbar.style.display = "block"
  }
  hideButton() {
    this.navbarHidden = !this.navbarHidden
    this.hideShow()
  }
  isSmall() {
    if (document.body.offsetWidth < 769) {
      this.navbarHidden = true
    }
    else {
      this.navbarHidden = false
    }
    this.hideShow()
  }
  setMenuWords() {
    this.points = [
      {path:"home",name:"Home"},
      {path:"products/accessories",name:"Accessories"},
      {path:"products/pcs",name:"PCs"},
      {path:"products/laptops",name:"Laptops"},
      {path:"products/servers",name:"Servers"},
      {path:"products/services",name:"Services"},
      {path:"aboutus",name:"About Us"},
      {path:"login",name:"Login"},
      {path:"user",name:"User"},
      {path:"logout",name:"Log Out"},
    ]
  }
  getPoints() {
    return this.points.slice(0,7)
  }

  userIsAdmin(){
    return this.auth.getIsAdmin()
  }
}
