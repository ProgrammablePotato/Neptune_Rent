import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoading: boolean = false

  loggedUser:any
  private userSub= new BehaviorSubject<any>(null)
  private adminSub= new BehaviorSubject<boolean>(false)
  private loggedUserSub= new BehaviorSubject<boolean>(false)

  apiUrl = 'http://127.0.0.1:5001/neptune-rent/us-central1/api/'

  constructor(private auth:AngularFireAuth, private router:Router, private http:HttpClient) {
    this.auth.authState.subscribe(
      (user:any)=>{
        if (user){
          this.loggedUser=user?._delegate
          console.log("User", user)
          user.getIdToken().then(
            (token: any) => {
              this.loggedUser.accessToken = token
              const headers = new HttpHeaders().set('Authorization', token)
              this.http.get(this.apiUrl + "getClaims/" + user.uid, { headers }).subscribe(
                {
                  next: (claims) => {
                    console.log("Claims", claims)
                    this.loggedUser.claims = claims
                    this.userSub.next(this.loggedUser)
                    this.adminSub.next(this.loggedUser.claims.admin)
                    this.loggedUserSub.next(true)
                    console.log("User: ", this.loggedUser)
                  },
                  error: (error) => {
                    console.log(error)
                    this.loggedUser = null
                    this.userSub.next(null)
                    this.adminSub.next(false)
                    this.loggedUserSub.next(false)
                  }
                }
              )
          })
          .catch(
          (error:any)=>console.error(error)
          )
        }
        else {
          this.loggedUser=null
          this.userSub.next(null)
          this.adminSub.next(false)
          this.loggedUserSub.next(false)
        }
      }
    )
  }

  getLoadingStatus() {
    return this.isLoading
  }

  setLoadingStatus(status: boolean) {
    this.isLoading = status
  }

  registerUser(email:string, password:string){
    this.auth.createUserWithEmailAndPassword(email, password)
    .then(()=>{
      this.auth.currentUser.then(
        (user)=>{
          user?.sendEmailVerification()
        }
      ).then(
        ()=>this.logout()
      ).
      then(
        ()=> this.router.navigate(['verifymail'])
      )
      .catch((e)=>alert(e))
    })
  }

  loginUser(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  logout() {
    return this.auth.signOut()
  }

  getCurrentUser() {
    return this.auth.authState;
  }

  loginWithGoogle() {
    return this.auth.signInWithPopup(new GoogleAuthProvider())
  }

  getLoggedUser(){
    return this.userSub
  }

  forgotPassword(email:string){
    this.auth.sendPasswordResetEmail(email).then(
      ()=>console.log("Email sned!")
    )
  }

  getIsAdmin(){
    return this.adminSub
  }

  getUsers(){
    if (this.loggedUser.accessToken)
    {
      const headers= new HttpHeaders().set('Authorization',this.loggedUser.accessToken)
      return this.http.get(this.apiUrl+"users", {headers})
    }
    return null
  }

  setUserClaims(uid:any,claims:any){
    if (this.loggedUser.accessToken)
      {
        let body={
          claims:claims,
          uid:uid
        }
        const headers= new HttpHeaders().set('Authorization',this.loggedUser.accessToken)
        return this.http.post(this.apiUrl+"setCustomClaims",body, {headers})
      }
      return null
  }

  updateUser(displayName:any, phoneNumber:any, email:any, password:any){
    if (this.loggedUser.accessToken)
      {
        let body={displayName, phoneNumber, email, password}
        const headers= new HttpHeaders().set('Authorization',this.loggedUser.accessToken)
        return this.http.patch(this.apiUrl+"updateUser/",body, {headers})
      }
      return null
  }
}
