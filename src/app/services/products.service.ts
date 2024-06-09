import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PaginationParams, Product, Products } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private apiService: ApiService) {}

  getProducts = (
    url: string,
    params: PaginationParams
  ): Observable<Products> => {
    return this.apiService.get(url, {
      params,
      responseType: 'json',
    });
  };

  addProduct = (url: string, product: Product): Observable<Product> => {
    return this.apiService.post(url, product, {});
  };

  editProduct = (
    url: string,
    id: number,
    product: Product
  ): Observable<Product> => {
    return this.apiService.put(`${url}/${id}`, product, {});
  };

  deleteProduct = (url: string, id: number): Observable<Product> => {
    return this.apiService.delete(`${url}/${id}`, {});
  };

  getProduct = (url: string, id: number): Observable<Product> => {
    return this.apiService.get(`${url}/${id}`, {});
  };
}
