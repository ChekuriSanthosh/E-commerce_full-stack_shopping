import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './services/user.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User, ProductDto } from './models/user.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatBadgeModule,
    MatDialogModule,
    CartComponent,
    OrdersComponent,
    ProductDetailComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('productDetailDialog') productDetailDialog!: TemplateRef<any>;
  
  user: User | null = null;
  products: ProductDto[] = [];
  filteredProducts: ProductDto[] = [];
  categories: string[] = [];
  searchControl = new FormControl('');
  selectedCategory = '';
  loading = false;
  currentView: 'main' | 'cart' | 'orders' = 'main';
  groupedProducts: Map<string, ProductDto[]> = new Map();
  selectedProduct: ProductDto | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.setupSearch();
    this.loadProducts();
  }

  loadUserData() {
    const token = localStorage.getItem('jwt.auth');
    if (token) {
      this.authService.getUsernameFromToken(token).subscribe({
        next: (email: string) => {
          this.userService.getUserByEmail(email).subscribe({
            next: (user) => {
              this.user = user;
              this.loadCartTotal();
            },
            error: (error: any) => {
              console.error('Error loading user:', error);
              if (error.status === 404) {
                this.showMessage('User not found');
              } else {
                this.showMessage('Error loading user data');
              }
            }
          });
        },
        error: (error: any) => {
          console.error('Error validating token:', error);
          if (error.status === 401) {
            this.showMessage('Session expired. Please login again');
          } else {
            this.showMessage('Error validating session');
          }
          this.authService.logout();
          this.router.navigate(['/']);
        }
      });
    }
  }

  private loadCartTotal() {
    if (this.user) {
      this.userService.getCartTotal(this.user.userId).subscribe();
    }
  }

  private setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchProducts(term || '');
    });
  }

  private loadProducts() {
    this.loading = true;
    this.userService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.categories = [...new Set(products.map(p => p.category))];
        this.groupProductsByCategory();
        this.loading = false;
      },
      error: (error) => {
        this.showMessage('Error loading products');
        this.loading = false;
      }
    });
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Electronics': 'devices',
      'Clothing': 'checkroom',
      'Books': 'menu_book',
      'Food': 'restaurant',
      'Beauty': 'spa',
      // Add more category-icon mappings as needed
    };
    return icons[category] || 'category';
  }

  openProductDetails(product: ProductDto) {
    this.selectedProduct = product;
    this.dialog.open(this.productDetailDialog, {
      width: '600px',
      data: { product, user: this.user }
    });
  }

  searchProducts(term: string) {
    const searchTerm = term.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
    this.groupProductsByCategory();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filteredProducts = category ? 
      this.products.filter(p => p.category === category) : 
      this.products;
    this.groupProductsByCategory();
  }

  private groupProductsByCategory() {
    this.groupedProducts.clear();
    this.filteredProducts.forEach(product => {
      if (!this.groupedProducts.has(product.category)) {
        this.groupedProducts.set(product.category, []);
      }
      this.groupedProducts.get(product.category)?.push(product);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
