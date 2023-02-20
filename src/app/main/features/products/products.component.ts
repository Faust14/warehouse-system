import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Floor, Product} from "../../models/product-model";
import {UntypedFormControl} from "@angular/forms";
import {ProductService} from "../../services/product.service";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {Subject, merge, Observable} from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  @ViewChild('createEdit')
  modal: any;
  floors: Floor[];
  search = new UntypedFormControl('');
  sections: number[] = [];
  products: Product[] = [];
  destroy$ = new Subject<void>();
  checkedFloor: Floor;
  fetch$ = new Subject<void>();

  constructor(private service: ProductService) {
  }

  ngOnInit() {
    this.createSearchTerm();
    this.fetch$.next();
  }

  createSearchTerm() {
    merge(this.searchTerm(), this.fetch$).pipe(
      switchMap(() => this.getAllProducts()),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.floors = [];
      this.products = [];
      this.sections = [];
      this.checkedFloor = null!;
      this.floors = res;
      this.floors.forEach((value: Floor) => {
        value.products = value.products.filter((product: Product) => product.code.toLowerCase().includes(this.search.value.toLowerCase()));
        this.products = this.products.concat(value.products);
      })
    })
  }

  getAllProducts(): Observable<Floor[]> {
    return this.service.getAllProducts();
  }

  searchTerm(): Observable<string> {
    return this.search.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
  }

  setProducts(floor: Floor): void {
    this.checkedFloor = floor;
    this.products = new Array<Product>().concat(floor.products);
    this.sections = this.service.createSections(this.products);
  }

  filterBySection(section: number): void {
    this.products = this.checkedFloor.products;
    if (this.checkedFloor.name) {
      if (section !== 0) {
        this.products = this.products.filter((product: Product) => product.section === section);
      } else {
        this.products = this.checkedFloor.products;
      }
    }
  }

  reset(): void {
    this.checkedFloor = null!;
    this.search.setValue('');
    this.fetch$.next();
  }

  setProduct(product: Product): void {
    this.modal.showDialog(product);
  }

  isSubmited(isSubmited: boolean) {
    if (isSubmited) {
      this.fetch$.next();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
