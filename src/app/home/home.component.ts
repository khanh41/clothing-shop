import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { error } from 'console';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private productService: ProductsService) {}
  productInit() {
    return {
      name: '',
      price: '',
      image: '',
      rating: 0,
    };
  }

  @ViewChild('paginator') paginator: Paginator | undefined;

  products: Product[] = [];

  totalRecords: number = 0;
  rows: number = 5;

  selectedProduct: Product = this.productInit();

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  toggleDeletePopup(product: Product) {
    if (!product.id) return;
    this.deleteProduct(product.id);
  }

  onProductOutput(product: Product) {
    console.log(product, 'Output');
  }

  onPageChange(event: any) {
    this.fetProducts(event.page, event.rows);
  }

  onConfirmEdit(product: Product) {
    if (this.selectedProduct.id) {
      this.editProduct(product, this.selectedProduct.id);
    }
    this.displayEditPopup = false;
    this.selectedProduct = this.productInit();
  }

  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopup = false;
    this.selectedProduct = this.productInit();
  }

  onCanclePopup() {
    this.displayEditPopup = false;
    this.displayAddPopup = false;
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  fetProducts(page: number, perPage: number) {
    this.productService
      .getProducts('http://localhost:3000/clothes', { page, perPage })
      .subscribe({
        next: (data: Products) => {
          this.products = data.items;
          this.totalRecords = data.total;
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error, 'Error');
        },
      });
  }

  editProduct(product: Product, id: number) {
    this.productService
      .editProduct(`http://localhost:3000/clothes`, id, product)
      .subscribe({
        next: (data) => {
          console.log(data, 'Edit');
          this.fetProducts(0, this.rows);
        },
        error: (error) => {
          console.log(error, 'Error');
        },
      });
  }

  deleteProduct(id: number) {
    this.productService
      .deleteProduct(`http://localhost:3000/clothes`, id)
      .subscribe({
        next: (data) => {
          console.log(data, 'Delete');
          this.fetProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error, 'Error');
        },
      });
  }

  addProduct(product: Product) {
    this.productService
      .addProduct(`http://localhost:3000/clothes`, product)
      .subscribe({
        next: (data) => {
          console.log(data, 'Add');
          this.fetProducts(0, this.rows);
        },
        error: (error) => {
          console.log(error, 'Error');
        },
      });
  }

  ngOnInit() {
    this.fetProducts(0, this.rows);
  }
}
