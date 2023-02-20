import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductComponent } from './main/features/product/product.component';
import {SharedModule} from "./shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ProductsComponent } from './main/features/floors/products.component';
import { CreateEditProductComponent } from './main/features/create-edit-product/create-edit-product.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ProductsComponent,
    CreateEditProductComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
