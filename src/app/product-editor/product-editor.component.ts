import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../base.service';
import { initDropdowns, initFlowbite } from 'flowbite';
import { AppComponent } from '../app.component';
import { dropdownCollapse, dropdownExtend } from '../app.component';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.css'
})
export class ProductEditorComponent {
  public dropdownCollapse = dropdownCollapse
  public dropdownExtend = dropdownExtend

  categories = ["Accessories","PCs","Laptops","Servers","Services"]
  product: any = null
  category: string = ""
  loading: boolean = true
  error: string | null = null
  editingField: string | null = null
  productId:number = 0
  imageUrl?: string

  constructor(private activeRouter: ActivatedRoute, private base: BaseService, private router:Router) { }

  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      console.log("File", file)
      this.base.uploadImage(file).subscribe({
        next: (res: any) => {
          console.log("formdata",formData)
          this.imageUrl = `http://localhost:3000/upload/${res.imageUrl}`
          this.product.image_url = res.imageUrl
        },
        error: (err) => console.error("Upload error:", err)
      })
    }
  }

  ngOnInit() {
    const category = this.activeRouter.snapshot.paramMap.get('category')
    this.productId = Number(this.activeRouter.snapshot.paramMap.get('id'))
    if (category == "new") {
      this.category = category
      this.product = {
        name: "",
        category: "",
        brand: "",
        price: 0,
        description: "",
        image_url: "no",
        stock: 0,
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
    this.product.category = this.product.category.toLowerCase()
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
    console.log(this.product)
    this.editingField = null
    let message = this.isFilled()
    if (message == "") {
      this.startAdd()
    }
    else {
      this.errorMessage(message)
    }
  }
  isFilled() {
    let message = ""
    Object.values(this.product).forEach((data) => {
      if (data == "" || data == 0) {
        message = "Please fill all fields correctly before registering the new product!"
      }
    })
    return message
  }
  errorMessage(message:string) {
    if (message == "") {
      console.log("no error")
      return
    }
    var alert:any = document.getElementById("alert-incorrect-data")
    alert.style.display = "block"
    alert.innerHTML = message
  }
  startAdd() {
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
  setCategory(category:string) {
    this.product.category = category
    dropdownCollapse('category')
  }
  getCategory() {
    if (this.product.category == "") {
      return "Select a category"
    } return this.product.category
  }
}
