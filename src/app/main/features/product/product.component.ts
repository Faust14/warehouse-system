import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../models/product-model";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  @Input()
  products: Product[] = [];
  @Output()
  productEmitter = new EventEmitter<Product>()
  emitProduct(product: Product) {
    this.productEmitter.emit(product)
  }
}
