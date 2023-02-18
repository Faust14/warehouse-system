import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Floor, Product} from "../models/product-model";

export var DATA =  [
    {
      id: 1,
      name: "Floor 1",
      products: [{
        code: "MYTZ 123456",
        quantity: 100,
        section: 3,
        floor: 1
      },
        {
          code: "UK 134662",
          quantity: 12,
          section: 6,
          floor: 1
        },
        {
          code: "KOB 8472",
          quantity: 1,
          section: 7,
          floor: 1
        },
        {
          code: "KOB 845",
          quantity: 2,
          section: 4,
          floor: 1
        }]
    },
    {
      id: 2,
      name: "Floor 2",
      products: [{
        code: "MY 123456",
        quantity: 20,
        section: 3,
        floor: 2
      },
        {
          code: "MOT 123456",
          quantity: 10,
          section: 4,
          floor: 2
        },
        {
          code: "ROT 123456",
          quantity: 100,
          section: 5,
          floor: 2
        }]
    },
    {
      id: 3,
      name: "Floor 3",
      products: [{
        code: "MQ 123456",
        quantity: 20,
        section: 8,
        floor: 3
      },
        {
          code: "DOT 123456",
          quantity: 10,
          section: 9,
          floor: 3
        },
        {
          code: "SOT 123456",
          quantity: 100,
          section: 10,
          floor: 3
        }]
    }
  ]
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  _floors$ = new BehaviorSubject<Floor[]>(DATA);
  floors$ = this._floors$.asObservable();
  constructor() {
  }

  getAllProducts(): Observable<Floor[]> {
    return this.floors$;
  }
  createEditProduct(floors: Floor[]): any {
   this._floors$.next(floors);
  }

  createSections(products: Product[]): number[] {
    let section: number[] = [0]
      products.forEach(product=> {
        if(product.section) {
          section.push(product.section)
        }
      })
    return section
  }
}
