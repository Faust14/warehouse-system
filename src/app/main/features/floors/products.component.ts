import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  selector: 'app-floors',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  @ViewChild('createEdit')
  modal:any;
  floors: Floor[];
  search = new UntypedFormControl('');
  sections: number[] = [];
  products: Product[] = [];
  destroy$ = new Subject<void>();
  checkedFloor: Floor;
  fetch$ = new Subject<void>();
  constructor(private service: ProductService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initData();
    this.createSearchTerm();
  }

  createSearchTerm() {
    merge(this.searchTerm(),this.fetch$).pipe(
      switchMap(() => {
       return  this.getAllProducts()
      }),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      if(this.search.value) {
        res.forEach((value: Floor) => {
          value.products = value.products.filter((product: Product) => product.code.toLowerCase().includes(this.search.value.toLowerCase()));
        });
      }
      this.products = [];
      this.floors = res;
      this.floors.forEach(floor => {
        floor.products.forEach(product => {
          this.products.push(product);
        })
      })
      this.cdr.markForCheck();
    })
  }
  initData() {
    this.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.floors = res;
      this.setAllProducts();
      this.sections = [0]
    })
  }

  getAllProducts(): Observable<Floor[]> {
    return this.service.getAllProducts();
  }

  searchTerm(): Observable<string> {
    return this.search.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged())
  }

  setProducts(floor: Floor): void {
    this.checkedFloor = floor;
    this.products = new Array<Product>().concat(floor.products);
    this.sections = this.service.createSections(this.products);
  }

  filterBySection(section: number):void {
    this.products = this.checkedFloor.products;
    if (this.checkedFloor.name) {
      if (section !== 0) {
        this.products = this.products.filter((product: Product) => product.section === section);
      } else {
        this.products = this.checkedFloor.products;
      }
    }
  }
  setAllProducts():void {
    this.floors.forEach(floor => {
      floor.products.forEach(product => {
        this.products.push(product);
      })
    })
  }

  reset(): void {
    this.checkedFloor = null!;
    this.products = [];
    this.sections = [0];
    this.floors = [];
    this.search.setValue('');
    this.fetch$.next();
  }

  setProduct(event: Product): void{
    this.modal.showDialog(event);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
