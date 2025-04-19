import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as countryCodes from "country-codes-list";
import removeAccents from 'remove-accents';
import { dropdownCollapse, dropdownExtend } from '../app.component';
import { BaseService } from '../base.service';
import { Validators } from '@angular/forms';

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
  newPassword = null
  isDropdownOpen = false
  clickCount = 0
  isEasterEggActive = false
  showToast = false
  isToastHiding = false

  country: string = ''
  countryDisplay:string = ''
  countries:any[] = []
  filteredCountries:any[] = []
  countryText:string = ""

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    this.saveCredentials()
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
      "")?.subscribe(
      (res) => {
        console.log("User data upload success")
        this.showToastNotification()
      }
    )
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

  saveCredentials(){
    if (Validators.email(this.loggedUser.email) != null) {
      return
    }
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

  toggleDropdown(type: string) {
    if (type === 'country') {
      this.isDropdownOpen = !this.isDropdownOpen
      if (this.isDropdownOpen) {
        this.filteredCountries = [...this.countries]
        this.countryText = ''
      }
    }
  }

  selectCountry(code:string) {
    this.country = code
    this.getCountry(code)
    this.isDropdownOpen = false
  }

  filterCountry() {
    if (!this.countryText) {
      this.filteredCountries = [...this.countries]
      return
    }
    const searchText = this.countryText.toLowerCase().trim()
    this.filteredCountries = this.countries.filter(country => 
      country.countryNameEn.toLowerCase().includes(searchText) ||
      removeAccents(country.countryNameEn.toLowerCase()).includes(searchText)
    )
  }

  validatePassword() {
    if (this.loggedUser.password.trim() == '' || this.loggedUser.password.trim().length < 6) {
      alert("Please provide a password consisting of lower- and uppercase letters and numbers, with at least 6 characters in it!")
      return false
    }
    else if (/[^\w]+/.test(this.loggedUser.password.trim())) {
      alert("The password can only contain lower- and uppercase letters, as well as digits!")
      return false
    }
    return true
  }

  handleProfileClick() {
    this.clickCount++
    if (this.clickCount >= 5 && !this.isEasterEggActive) {
      this.isEasterEggActive = true
      this.activateEasterEgg()
    }
  }

  activateEasterEgg() {
    const profileSection = document.querySelector('.profile-section')
    if (profileSection) {
      profileSection.classList.add('rainbow-effect')
      this.addFloatingEmojis()
      setTimeout(() => {
        this.isEasterEggActive = false
        this.clickCount = 0
        profileSection.classList.remove('rainbow-effect')
      }, 10000)
    }
  }

  addFloatingEmojis() {
    const emojis = ['🎉', '✨', '🌟', '🎊', '🎈']
    const container = document.querySelector('.profile-section')
    if (container) {
      for (let i = 0; i < 20; i++) {
        const emoji = document.createElement('div')
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)]
        emoji.style.position = 'absolute'
        emoji.style.left = Math.random() * 100 + '%'
        emoji.style.top = Math.random() * 100 + '%'
        emoji.style.fontSize = Math.random() * 20 + 20 + 'px'
        emoji.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite`
        container.appendChild(emoji)
      }
    }
  }

  showToastNotification() {
    this.showToast = true
    this.isToastHiding = false
    setTimeout(() => {
      this.hideToast()
    }, 5000)
  }

  hideToast() {
    this.isToastHiding = true
    setTimeout(() => {
      this.showToast = false
      this.isToastHiding = false
    }, 300)
  }
}
