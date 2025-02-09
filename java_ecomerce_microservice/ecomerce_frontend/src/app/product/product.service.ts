import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Product, NewProduct } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8888/product';

  constructor(private http: HttpClient) {}

  addProduct(product: NewProduct): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/addproduct`, product);
  }

  getAllProducts(): Observable<Product[]> {
    console.log('Fetching products from:', this.baseUrl);
    return this.http.get<Product[]>(this.baseUrl)
      .pipe(
        tap(response => {
          console.log('Products API Response:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Products API Error:', error);
          if (error.status === 0) {
            console.error('Is the backend server running?');
          }
          throw error;
        })
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/viewproduct/${id}`);
  }

  updateProduct(id: number, product: NewProduct): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/editproduct/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteproduct?id=${id}`);
  }
} 