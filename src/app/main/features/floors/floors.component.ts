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
  templateUrl: './floors.component.html',
  styleUrls: ['./floors.component.css']
})
export class FloorsComponent implements OnInit, OnDestroy {

  @ViewChild('createEdit')
  modal:any;
  floors: Floor[];
  search = new UntypedFormControl('');
  sections: number[] = [];
  products: Product[] = [];
  destroy$ = new Subject<void>();
  choosedFloor: Floor;
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
        debugger
       return  this.getAllProducts()
      }),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      debugger
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

  searchTerm() {
    return this.search.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged())
  }

  setProducts(floor: Floor): void {
    this.choosedFloor = floor;
    this.products = new Array<Product>().concat(floor.products);
    this.sections = this.service.createSections(this.products)
    this.cdr.markForCheck();
  }

  filterBySection(section: number) {
    this.products = this.choosedFloor.products;
    if (this.choosedFloor.name) {
      if (section !== 0) {
        this.products = this.products.filter((product: Product) => product.section === section);
      } else {
        this.products = this.choosedFloor.products;
      }
    }
  }
  setAllProducts() {
    this.floors.forEach(floor => {
      floor.products.forEach(product => {
        this.products.push(product);
      })
    })
  }

  reset() {
    this.choosedFloor = null!;
    this.products = [];
    this.sections = [0];
    this.floors = [];
    this.search.setValue('');
    this.fetch$.next();
  }

  setProduct(event: Product){
    this.modal.showDialog(event);
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
}
