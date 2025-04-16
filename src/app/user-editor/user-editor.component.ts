import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.css'
})
export class UserEditorComponent implements OnInit{
  loggedUser:any
  users:any
  uid:string = ""

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  constructor(private auth:AuthService,private base:BaseService){
    this.auth.getLoggedUser().subscribe(
      (loggedUser)=>{
        this.loggedUser=loggedUser
        console.log("Users logged", this.loggedUser)
        if (this.loggedUser) this.auth.getUsers()?.subscribe(
          {
            next: (users)=>{this.users = users
              console.log(this.users)
            }
          }
        )
      }
    )
  }

  setCustomClaims(uid:any, claims:any){
    this.auth.setUserClaims(uid, claims)?.subscribe()
  }

  change(uid:any){
    let tomb=this.users.filter(
      (elem:any)=>elem.uid==uid
    )
    console.log(tomb)
    this.auth.setUserClaims(uid,tomb[0].claims)?.subscribe()
  }

  startDeleteUser(uid:string) {
    this.uid = uid
    this.toggleModal(true)
  }

  deleteUser(uid:string) {
    this.base.deleteUser(uid).subscribe(
      {
        next: () => {console.log("User deleted")},
        error: (error) => {console.log("Error while dleeting the user!")} 
      }
    )
    this.toggleModal(false)
  }

  toggleModal(on:boolean) {
    var modal:any = document.getElementById("confirm-modal")
    if (on) {
      modal.style.display = "block"
    } else {
      modal.style.display = "none"
    }
  }
}
