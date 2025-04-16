import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit{
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
