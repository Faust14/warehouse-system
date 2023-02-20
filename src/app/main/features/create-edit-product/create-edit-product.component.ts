import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../services/product.service";
import {Floor, Product} from "../../models/product-model";

@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.css']
})
export class CreateEditProductComponent implements OnInit {

  @ViewChild('dialog')
  dialog: HTMLDialogElement;
  @Input()
  floors: Floor[];
  @Input()
  isEdit: boolean;
  formGroup: FormGroup;
  errorMessage: string;
  isDuplicate: boolean;
  product: Product;

  constructor(private service: ProductService, public fb: FormBuilder) {
  }

  createForm(): void {
    this.formGroup = this.fb.group({
      codeText: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4), Validators.pattern('[a-zA-Z]+')]],
      serialNumber: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      floor: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      section: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.createForm();
  }

  submit(dialog: any): void {
    const floorId = Number(this.formGroup.get('floor')?.value);
    const sectionId = Number(this.formGroup.get('section')?.value);
    const quantity = this.formGroup.get('quantity')?.value;
    const code = (this.formGroup.get('codeText')?.value).toUpperCase() + ' ' + this.formGroup.get('serialNumber')?.value;
    let product: Product = {
      code: code,
      floor: floorId,
      quantity: quantity,
      section: sectionId
    }
    this.floors.forEach(floor => {
      if (floor.id === floorId) {
        let duplicate = floor.products.find(value => (value.floor === floorId && value.section === sectionId) || !this.isEdit ? value.code === code : false);
        this.isDuplicate = !!duplicate;
        if (duplicate) {
          this.errorMessage = duplicate.code === code ? 'Product with this code already exist' : 'There is another product on this location';
        } else {
          this.floors[product.floor - 1].products.push(product);
        }
      } else {
        let index = floor.products.findIndex(value => value.code === product.code);
        if (index > -1) floor.products.splice(index, 1);
      }
    })
    if (!this.isDuplicate) {
      this.service.createEditProduct(this.floors)
      this.isEdit = false;
      this.formGroup.reset();
      dialog.close();
    }
  }

  closeDialog(dialog: any) {
    this.formGroup.enable();
    this.formGroup.reset();
    dialog.close();
  }

  showDialog(product: Product): void {
    this.isEdit = true;
    this.product = product;
    const splitCode = product.code.split(' ');
    const codeText = splitCode[0];
    const serialNumber = splitCode[1];
    this.formGroup.setValue({
      codeText: codeText,
      serialNumber: serialNumber,
      quantity: product.quantity,
      section: product.section,
      floor: product.floor
    })
    this.formGroup.get('codeText')?.disable();
    this.formGroup.get('serialNumber')?.disable();
    const modal: any = document.getElementById('modal');
    modal.showModal();
  }

  resetForm(): void {
    const splitCode = this.product.code.split(' ');
    const codeText = splitCode[0];
    const serialNumber = splitCode[1];
    this.formGroup.setValue({
      codeText: codeText,
      serialNumber: serialNumber,
      quantity: this.product.quantity,
      section: this.product.section,
      floor: this.product.floor
    })
  }
}
