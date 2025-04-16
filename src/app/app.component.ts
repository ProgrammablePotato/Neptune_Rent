import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { delay } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'NeptuneRent';

  ngOnInit(): void {
    initFlowbite();
  }
}
export async function newsCarouselSlide(news:any[]) {
    let activeNews:any
    // let nextNews:any
    let newsCount = 0
    var activeItem = document.getElementById("active-carousel-item")
    // var inactiveItem = document.getElementById("inactive-carousel-item")
    while (true) {
      activeNews = news[newsCount]
      delay(5000)
      newsCount++
    }
  }
export function dropdownCollapse(id:string) {
    var dropdown:any = document.getElementById(`neptune-dropdown-${id}`)
    dropdown.style.display = "none"
  }
export function dropdownExtend(id:string) {
    var dropdown:any = document.getElementById(`neptune-dropdown-${id}`)
    dropdown.style.display = "block"
  }
