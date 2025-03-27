import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editor-menu',
  templateUrl: './editor-menu.component.html',
  styleUrl: './editor-menu.component.css'
})
export class EditorMenuComponent {
  products:any[] = []

  constructor(private base:BaseService) {
    this.getProducts()
  }

  getProducts() {
    this.base.getProducts().then((products:any) => {
      this.products = products
      console.log("Editor products",this.products)
    })
  }

  deleteProduct(id: number) {
    this.base.deleteProduct(id).subscribe({
      next: () => {
        console.log("Item deleted!")
        this.products = this.products.filter(p => p.id !== id)
      },
      error: () => console.log("Error while deleting item!")
    })
  }
}
