import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.css'
})
export class ProductEditorComponent {
  product: any = null
  loading: boolean = true
  error: string | null = null
  editingField: string | null = null
  productId:number = 0

  constructor(private activeRouter: ActivatedRoute, private base: BaseService) { }

  ngOnInit(): void {
    const category = this.activeRouter.snapshot.paramMap.get('category')
    this.productId = Number(this.activeRouter.snapshot.paramMap.get('id'))
    if (category && !isNaN(this.productId)) {
      this.base.getProductByCategoryAndId(category, this.productId)
        .then(
          (data) => {
            this.product = data
            this.loading = false
            console.log("Product loaded!")
          })
          .catch( (error) => {
            this.error = 'Error!'
            this.loading = false;
          })
    } else {
      this.error = 'Invalid product data!'
      this.loading = false;
    }
  }

  edit(field: string): void {
    this.editingField = field
  }

  save(){
    this.base.editProduct(this.productId, this.product).subscribe(
      {
        next: () => console.log(this.product, this.productId, this.product.category),
        error: () => console.error('Error!')
      }
    )
  }
}
