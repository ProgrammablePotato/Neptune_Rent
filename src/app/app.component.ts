import { Component, OnInit } from '@angular/core';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Neptune_Rent';

  constructor(private scrollService: ScrollService) {}

  ngOnInit() {
    this.scrollService.initScrollAnimation();
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
