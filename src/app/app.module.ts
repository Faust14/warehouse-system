import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductComponent } from './main/features/product/product.component';
import {SharedModule} from "./shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FloorsComponent } from './main/features/floors/floors.component';
import { CreateEditProductComponent } from './main/features/create-edit-product/create-edit-product.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    FloorsComponent,
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
