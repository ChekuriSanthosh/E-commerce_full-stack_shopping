import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from './product.service';
import { Product, NewProduct } from './product.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product',
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
    MatTooltipModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  showAddForm = false;
  searchTerm = '';
  selectedFile: File | null = null;
  loading = false;
  isEditing = false;
  editingProductId: number | null = null;
  readonly acceptedImageTypes = "image/jpeg,image/jpg,image/png,image/webp,image/gif";

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadProducts();
  }

  private createForm(product?: Product) {
    this.productForm = this.fb.group({
      name: [product?.name || '', Validators.required],
      description: [product?.description || '', Validators.required],
      price: [product?.price || 0, [Validators.required, Validators.min(0)]],
      quantityAvailable: [product?.quantityAvailable || 0, [Validators.required, Validators.min(0)]],
      category: [product?.category || '', Validators.required],
      imageUrl: [product?.imageUrl || '']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!this.acceptedImageTypes.includes(file.type)) {
        this.showMessage('Please select a valid image file (jpg, jpeg, png, webp, gif)');
        return;
      }

      // Get just the filename from the full path
      const fullPath = file.name;
      const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
      
      // Update the form with the normalized path
      this.productForm.patchValue({
        imageUrl: `assets/${filename}`
      });
    }
  }

  loadProducts() {
    console.log('Starting to load products');
    this.loading = true;
    this.filteredProducts = [];
    this.products = [];

    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        console.log('Raw products received:', products);
        
        if (!products || products.length === 0) {
          console.log('No products found in response');
          this.showMessage('No products found');
          this.loading = false;
          return;
        }

        // Validate the data structure
        const validProducts = products.filter(p => {
          const isValid = p && typeof p === 'object' && 'productId' in p;
          if (!isValid) {
            console.warn('Invalid product found:', p);
          }
          return isValid;
        });

        console.log('Valid products:', validProducts);
        
        this.products = validProducts;
        this.filteredProducts = validProducts;
        
        // Get unique categories
        this.categories = [...new Set(validProducts.map(p => p.category))].filter(Boolean);
        
        console.log('Categories:', this.categories);
        console.log('Filtered products:', this.filteredProducts);
        
        this.loading = false;
        this.showMessage(`Loaded ${this.products.length} products`);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error in component while loading products:', error);
        let errorMessage = 'Error loading products: ';
        
        if (error.status === 0) {
          errorMessage += 'Cannot connect to server. Is it running?';
        } else {
          errorMessage += error.error?.message || error.message || 'Unknown error';
        }
        
        this.showMessage(errorMessage);
        this.loading = false;
        this.products = [];
        this.filteredProducts = [];
        this.categories = [];
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loading = true;
      const productData = this.productForm.value;
      
      // Ensure numeric fields are properly typed
      productData.price = Number(productData.price);
      productData.quantityAvailable = Number(productData.quantityAvailable);
      
      // Ensure imageUrl is in correct format
      if (productData.imageUrl && !productData.imageUrl.startsWith('assets/')) {
        productData.imageUrl = `assets/${productData.imageUrl.split('\\').pop()?.split('/').pop()}`;
      }

      const request = this.isEditing && this.editingProductId
        ? this.productService.updateProduct(this.editingProductId, productData)
        : this.productService.addProduct(productData);

      request.subscribe({
        next: () => {
          this.showMessage(`Product ${this.isEditing ? 'updated' : 'added'} successfully`);
          this.loadProducts();
          this.showAddForm = false;
          this.resetForm();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving product:', error);
          this.showMessage(`Error ${this.isEditing ? 'updating' : 'adding'} product: ` + 
            (error.error?.message || error.message));
          this.loading = false;
        }
      });
    }
  }

  filterProducts(category: string) {
    this.filteredProducts = category ? 
      this.products.filter(p => p.category === category) : 
      this.products;
  }

  searchProducts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p => 
      p.productId?.toString().includes(term) ||
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  editProduct(product: Product) {
    if (!product || !product.productId) {
      this.showMessage('Invalid product selected');
      return;
    }

    this.isEditing = true;
    this.editingProductId = product.productId;
    this.showAddForm = true;
    
    this.productService.getProductById(product.productId).subscribe({
      next: (freshProduct: Product) => {
        this.createForm(freshProduct);
        document.querySelector('.add-product-form')?.scrollIntoView({ behavior: 'smooth' });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading product:', error);
        this.showMessage('Error loading product details: ' + (error.error?.message || error.message));
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.isEditing = false;
    this.editingProductId = null;
    this.createForm();
    this.loading = false;
  }

  deleteProduct(productId: number | undefined) {
    if (!productId) return;
    
    this.loading = true;
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.showMessage('Product deleted successfully');
        this.loadProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.showMessage('Error deleting product: ' + (error.error?.message || error.message));
        this.loading = false;
      }
    });
  }
}
