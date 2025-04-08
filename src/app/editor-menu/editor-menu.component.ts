import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-editor-menu',
  templateUrl: './editor-menu.component.html',
  styleUrl: './editor-menu.component.css'
})
export class EditorMenuComponent {
  products:any[] = []
  filteredProducts:any = []
  searchTerm: string = ''
  public id = 0

  constructor(private base:BaseService, private search:SearchService) {
    this.getProducts()
  }

  getProducts() {
    this.base.getProducts().then((products:any) => {
      this.products = products
      console.log("Editor products",this.products)
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
  addTestProduct() {
    let product = {
      name: "Test",
      category: "pcs",
      brand: "UwU",
      price: 20,
      description: "Testing",
      image_url: "no",
      stock: 20,
      id : -1
    }
    console.log(product)
    this.base.addProduct(product).subscribe(
      {
        next: () => alert("Test product added!"),
        error: () => console.log("Failed to create product!")
      }
    )
  }
  getImagePath(file:string) {
    return "uploads/"+file
  }
}
