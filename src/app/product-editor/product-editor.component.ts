import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../base.service';
import { initDropdowns, initFlowbite } from 'flowbite';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.css'
})
export class ProductEditorComponent {
  categories = ["Accessories","PCs","Laptops","Servers","Services"]
  product: any = null
  category: string = ""
  loading: boolean = true
  error: string | null = null
  editingField: string | null = null
  productId:number = 0

  constructor(private activeRouter: ActivatedRoute, private base: BaseService, private router:Router) { }

  ngOnInit() {
    const category = this.activeRouter.snapshot.paramMap.get('category')
    this.productId = Number(this.activeRouter.snapshot.paramMap.get('id'))
    if (category == "new") {
      this.category = category
      this.product = {
        name: "",
        category: "Select a category",
        brand: "",
        price: 0,
        description: "",
        image_url: "no",
        stock: 1,
        id : -1
      }
      this.loading = false
    }
    else if (category && !isNaN(this.productId)) {
      this.base.getProductByCategoryAndId(category, this.productId)
        .then(
          (data) => {
            this.product = data
            this.loading = false
            console.log("Product loaded!")
          })
          .catch( (error) => {
            this.error = 'Error!'
            this.loading = false
          })
    } else {
      this.error = 'Invalid product data!'
      this.loading = false
    }
    initFlowbite()
  }

  edit(field: string): void {
    this.editingField = field
  }

  save(){
    if (this.category == "new") {
      this.add()
    }
    else{
      this.update()
    }
  }

  update(){
    this.base.editProduct(this.productId, this.product).subscribe(
      {
        next: () => {
          alert("Product edited")
          console.log(this.product, this.productId, this.product.category)
        },
        complete: () => this.router.navigate(['/admin/editormenu']),
        error: () => console.error('Error!')
      }
    )
  }

  add() {
    console.log("Adding: ",this.product)
    this.product.price = Number.parseFloat(this.product.price)
    this.product.stock = Number.parseInt(this.product.stock)
    this.product.category = this.product.category.toLowerCase()
    this.base.addProduct(this.product).subscribe(
      {
        next: () => alert("Product added!"),
        complete: () => this.router.navigate(['/admin/editormenu']),
        error: () => console.log("Failed to create product!")
      }
    )
  }

  image(){
    alert("Image upload is not available yet!")
  }
  dropDownToggle() {
    var dropdown:any = document.getElementById("dropdown")
    if (dropdown?.style.display == "none" || dropdown?.style.display == "") {
      dropdown.style.display = "block"
    } else {
      dropdown.style.display = "none"
    }
  }
  setCategory(category:string) {
    this.product.category = category
    this.dropDownToggle()
  }
}
