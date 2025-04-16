import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as countryCodes from "country-codes-list";
import removeAccents from 'remove-accents';
import { dropdownCollapse, dropdownExtend } from '../app.component';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  public dropdownCollapse = dropdownCollapse
  public dropdownExtend = dropdownExtend
  loggedUser:any
  isUserAdmin: boolean = false
  passwordVisibility = "password"
  userDetails:any

  country: string = ''
  countryDisplay:string = ''
  countries:any[] = []
  filteredCountries:any[] = []
  countryText:string = ""

  ngOnInit() {
    this.getAdmin()
    this.getLoggedUser()
    this.countryList()
  }

  constructor(private auth:AuthService, private route: ActivatedRoute, private router:Router, private base:BaseService){
    this.countryList()
    this.getCountry(this.country)
  }
  getLoggedUser() {
    this.auth.getLoggedUser().subscribe(
      {
        next: (res) => {
          this.loggedUser = res
          this.getUserDetails(res.uid)
        },
        error: (error) => {
          console.error("Error while getting the user's details!",error.message)
        }
      }
    )
  }
  getAdmin() {
    this.auth.getIsAdmin().subscribe((admin) => {
      this.isUserAdmin = admin
    })
  }

  saveUserDetails(){
    let details = this.userDetails
    this.auth.addNewUser(
      this.loggedUser.firebase_uid,
      details.name,
      details.zipcode,
      details.city,
      details.addr1,
      details.addr2,
      details.country,
      this.loggedUser.email,
      this.loggedUser.phoneNumber,
      details.nick)?.subscribe(
      (res) => {
        console.log("User data upload success")
      }
    )
    this.router.navigate(['/login'])
    this.auth.logout()
    alert("Please login again!")
  }

  getUserDetails(uid:string) {
    this.userDetails = this.base.getUserDetails(uid)?.subscribe({
      next: (res) => {
        this.userDetails = res
        console.log(this.userDetails)
      },
      error: (error) => {
        console.error('Error fetching user ID:', error)
      }
    })
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

  countryList() {
    this.countries = countryCodes.all()
    this.filteredCountries = this.countries
  }

  getCountry(code:string) {
    if (code == "") {
      this.countryDisplay = "Please select a country:"
    } else {
      this.countries.forEach(country => {
        if (country.countryCode == code) {
          this.countryDisplay = country.countryNameEn
          this.userDetails.country = code
        }
      })
    }
  }

  selectCountry(code:string) {
    this.country = code
    this.getCountry(code)
    this.dropdownCollapse('country')
  }

  filterCountry() {
    this.filteredCountries = []
    if (this.countryText == '' || this.countryText == null) {
      this.filteredCountries = this.countries
    } else {
      this.countries.forEach(country => {
        let name = country.countryNameEn.toLowerCase().trim()
        if (name.includes(this.countryText.trim().toLowerCase()) || removeAccents(name).includes(this.countryText.trim().toLowerCase())) {
          this.filteredCountries.push(country)
        }
      }
    )}
  }
}
