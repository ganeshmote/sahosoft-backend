import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AddProductComponent } from './physical/add-product/add-product.component';
import { ProductListComponent } from './physical/product-list/product-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [AddProductComponent, ProductListComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    NgxDatatableModule,
    CKEditorModule
  ]
})
export class ProductsModule { }
