import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User, CartItem, ProductDto } from '../models/user.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8888/user';
  private cartTotalSubject = new BehaviorSubject<number>(0);
  cartTotal$ = this.cartTotalSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/findbyemail/${email}`);
  }

  getProductById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/product/${id}`);
  }

  getAllProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/getallproducts`);
  }

  getProductsByCategory(category: string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/getByCategory`, {
      params: { category }
    });
  }

  addToCart(userId: number, productId: number, quantity: number): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/addcart/${userId}`, null, {
      params: { productId: productId.toString(), quantity: quantity.toString() }
    }).pipe(
      tap(() => this.updateCartTotal(userId))
    );
  }

  buyProduct(userId: number, productId: number, quantity: number): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/bought/${userId}`, null, {
      params: { productId: productId.toString(), quantity: quantity.toString() }
    });
  }

  getCartTotal(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/totalcart/${userId}`).pipe(
      tap(total => this.cartTotalSubject.next(total))
    );
  }

  removeFromCart(userId: number, productId: number): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/removeproduct/${userId}`, null, {
      params: { productId: productId.toString() }
    }).pipe(
      tap(() => this.updateCartTotal(userId))
    );
  }

  clearCart(userId: number): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/removecart/${userId}`, null);
  }

  private updateCartTotal(userId: number): void {
    this.getCartTotal(userId).subscribe();
  }
} 