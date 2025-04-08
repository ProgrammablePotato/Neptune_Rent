import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CountryProperty } from "country-codes-list";
import * as countryCodes from "country-codes-list";
import { dropdownCollapse, dropdownExtend } from '../app.component';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  public dropdownCollapse = dropdownCollapse
  public dropdownExtend = dropdownExtend

  isUserAdmin: boolean = false
  passwordVisibility = "password"
  zip: string = ''
  city: string = ''
  addr1: string = ''
  addr2: string = ''
  country: string = ''
  countryDisplay:string = ''
  name: string = ''
  nick: string = ''
  countries:any[] = []
  filteredCountries:any[] = []
  userCountry:any
  countryText:string = ""

  ngOnInit(): void{
    this.auth.getIsAdmin().subscribe((isAdmin) => {
      this.isUserAdmin = isAdmin
    })
  }

  loggedUser:any

  constructor(private auth:AuthService, private route: ActivatedRoute, private router:Router, private base:BaseService){
    this.auth.getLoggedUser().subscribe((user) => {
      this.loggedUser = user
    })
    this.getUserDetails()
    this.countryList()
    this.getCountry('')
  }

  saveUserDetails(){
    console.log(this.city, this.name, this.addr1, this.addr2, this.zip, this.country, this.loggedUser.email, this.loggedUser.phoneNumber, this.nick)
    this.auth.addNewUser(this.loggedUser.uid, this.name, this.zip, this.city, this.addr1, this.addr2, this.country, this.loggedUser.email, this.loggedUser.phoneNumber, this.nick)?.subscribe(
      (res) => {
        console.log("User data upload success")
      }
    )
  }
  getUserDetails() {
    
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
    console.log(this.countries)
    this.filteredCountries = this.countries
  }
  getCountry(code:string) {
    if (code == "") {
      this.countryDisplay = "Please select a country!"
    } else {
      this.countries.forEach(country => {
        if (country.countryCode == code) {
          this.countryDisplay = country.countryNameEn
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
    console.log(this.countryText)
    if (this.countryText == '' || this.countryText == null) {
      this.filteredCountries = this.countries
    }
    this.countries.forEach(country => {
      if (country.countryNameEn.toLowerCase().includes(this.countryText)) {
        this.filteredCountries.push(country)
      }
    })
  }
}
