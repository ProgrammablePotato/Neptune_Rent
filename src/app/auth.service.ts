import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoading: boolean = false

  loggedUser:any
  private userSub= new BehaviorSubject<any>(null)
  private adminSub= new BehaviorSubject<boolean>(false)
  private loggedUserSub= new BehaviorSubject<boolean>(false)

  fireApi = 'http://127.0.0.1:5001/neptune-rent/us-central1/api/'
  sqlApi = 'http://localhost:3000/users/'

  constructor(private auth:AngularFireAuth, private router:Router, private http:HttpClient) {
    this.authFunction()
  }

  authFunction(){
    this.auth.authState.subscribe(
      (user:any)=>{
        if (user){
          this.loggedUser=user?._delegate
          user.getIdToken().then(
            (token: any) => {
              this.loggedUser.accessToken = token
              const headers = new HttpHeaders().set('Authorization', `${token}`)
              this.http.get(this.fireApi + "getClaims/" + user.uid, { headers }).subscribe(
                {
                  next: (claims) => {
                    this.loggedUser.claims = claims
                    this.userSub.next(this.loggedUser)
                    this.adminSub.next(this.loggedUser.claims.admin)
                    this.loggedUserSub.next(true)
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
    return this.auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      if (userCredential.user?.emailVerified) {
        return userCredential
      } else {
        this.logout()
        throw { code: 'auth/email-not-verified' }
      }
    })
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
      return this.http.get(this.fireApi+"users", {headers})
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
        return this.http.post(this.fireApi+"setCustomClaims",body, {headers})
      }
      return null
  }

  updateUser(displayName:any, phoneNumber:any, email:any, password:any){
    if (this.loggedUser.accessToken)
      {
        let body={displayName, phoneNumber, email, password}
        const headers= new HttpHeaders().set('Authorization',this.loggedUser.accessToken)
        return this.http.patch(this.fireApi+"updateUser/",body, {headers})
      }
      return null
  }

  addNewUser(firebase_uid:string, name:string='', zipcode:string='', city:string='', addr1:string='', addr2:string='', country:string='', email:string='', phone:string='', nick:string=''){
    if (this.loggedUser.accessToken)
      {
        firebase_uid=this.loggedUser.uid
        let body={firebase_uid, name, zipcode, city, addr1, addr2, country, email, phone, nick}
        const headers = new HttpHeaders().set('Authorization', this.loggedUser.accessToken)
        return this.http.post(this.sqlApi, body, { headers })
      }
      return null
  }

  getUserId(firebaseUid: string): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.sqlApi}`, { details: 'id', firebase_uid: firebaseUid });
  }
  deleteUser(uid:string,claims:any) {
    if (this.loggedUser.accessToken)
      {
        let body={
          claims:claims,
          uid:uid
        }
        const headers= new HttpHeaders().set('Authorization',this.loggedUser.accessToken)
        return this.http.delete(`${this.fireApi}deleteUser/${uid}`,{ headers,body })
      }
    return null
  }

  deleteSelfUser() {
    this.auth.currentUser.then(user => user?.delete())
  }

  resendVerificationEmail() {
    this.auth.currentUser.then(user => {
      if (user) {
        user.sendEmailVerification()
      }
    })
  }
}
