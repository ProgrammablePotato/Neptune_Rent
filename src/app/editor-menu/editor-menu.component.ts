import { Component, OnInit } from '@angular/core';
import { BaseService } from '../base.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-editor-menu',
  templateUrl: './editor-menu.component.html',
  styleUrl: './editor-menu.component.css'
})
export class EditorMenuComponent implements OnInit {
  products:any[] = []
  filteredProducts:any = []
  searchTerm: string = ''
  id = 0

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  constructor(private base:BaseService, private search:SearchService) {
    this.getProducts()
  }

  getProducts() {
    this.base.getProducts().then((products:any) => {
      this.products = products
    })
  }

  startDelete(id:number) {
    this.id = id
    this.toggleModal(true)
  }

  deleteProduct(id: number) {
    this.base.deleteProduct(id).subscribe({
      next: () => {
        console.log("Item deleted!")
      },
      error: () => console.log("Error while deleting item!")
    })
    this.products = this.products.filter(p => p.id !== id)
    this.toggleModal(false)
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product: any) => 
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }

  searchProducts() {
    this.search.getSearchWord().subscribe((res) => {
      this.searchTerm = res
    })
  }

  toggleModal(on:boolean) {
    var modal:any = document.getElementById("confirm-modal")
    if (on) {
      modal.style.display = "block"
    } else {
      modal.style.display = "none"
    }
  }

  getImagePath(file:string) {
    return "uploads/"+file
  }
}
