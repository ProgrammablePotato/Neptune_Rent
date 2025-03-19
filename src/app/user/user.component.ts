import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  isUserAdmin: boolean = false
  passwordVisibility = "password"
  zip: string = ''
  city: string = ''
  addr1: string = ''
  addr2: string = ''
  country: string = ''
  name: string = ''

  ngOnInit(): void{
    this.auth.getIsAdmin().subscribe((isAdmin) => {
      this.isUserAdmin = isAdmin
    })
  }

  loggedUser:any

  constructor(private auth:AuthService, private route: ActivatedRoute, private router:Router){
    this.auth.getLoggedUser().subscribe((user) => {
      this.loggedUser = user
    })
  }

  bruh(){
    console.log(this.city, this.name, this.addr1, this.addr2, this.zip, this.country, this.loggedUser.email, this.loggedUser.phoneNumber)
    this.auth.addNewUser(this.loggedUser.uid, this.name, this.zip, this.city, this.addr1, this.addr2, this.country, this.loggedUser.email, this.loggedUser.phoneNumber)?.subscribe(
      (res) => {
        console.log("https://tenor.com/hu/view/finnish-hospital-kys-gif-27573537", res)
      }
    )
  }

  saveChanges(){
    this.auth.updateUser(this.loggedUser.displayName, this.loggedUser.phoneNumber, this.loggedUser.email, this.loggedUser.password)?.subscribe(
      (res) => {
        if(this.loggedUser.email != this.loggedUser.email){
          alert("Please login again with your new email!")
          this.auth.logout()
          this.router.navigate(['/login'])
        }
        else if(this.loggedUser.password){
          alert("Please login again with your new password!")
          this.auth.logout()
          this.router.navigate(['/login'])
        }
        console.log("Update", res)
      }
    )
  }

  changeVisibility() {
    if (this.passwordVisibility === "password") {
      this.passwordVisibility = "text"
    } else {
      this.passwordVisibility = "password"
    }
  }
}
