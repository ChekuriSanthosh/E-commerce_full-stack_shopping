import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, ProductDto } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="product-detail">
      <div class="product-image">
        <img [src]="product?.imageUrl" [alt]="product?.name">
      </div>
      
      <div class="product-info">
        <h2>{{product?.name}}</h2>
        <p class="description">{{product?.description}}</p>
        <p class="price">₹{{product?.price}}</p>
        
        <div class="stock-info">
          <span class="stock-status" 
                [class.in-stock]="product?.quantityAvailable! > 5"
                [class.low-stock]="product?.quantityAvailable! > 0 && product?.quantityAvailable! <= 5"
                [class.sold-out]="product?.quantityAvailable === 0">
            {{product?.quantityAvailable === 0 ? 'Sold Out' : 
              product?.quantityAvailable! <= 5 ? 'Low Stock' : 'In Stock'}}
          </span>
          <span class="quantity">{{product?.quantityAvailable}} items left</span>
        </div>

        <div class="actions" *ngIf="product?.quantityAvailable! > 0">
          <mat-form-field appearance="outline">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" [(ngModel)]="quantity" min="1" 
                   [max]="product?.quantityAvailable || 0">
          </mat-form-field>

          <div class="buttons">
            <button mat-raised-button color="primary" 
                    [disabled]="!isValidQuantity()"
                    (click)="addToCart()">
              Add to Cart
            </button>
            <button mat-raised-button color="accent"
                    [disabled]="!isValidQuantity()"
                    (click)="buyNow()">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail {
      padding: 20px;
      display: flex;
      gap: 30px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .product-image {
      flex: 1;
      max-width: 400px;
    }

    .product-image img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .product-info {
      flex: 1;
    }

    h2 {
      color: #1e3c72;
      margin: 0 0 15px 0;
    }

    .description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2a5298;
      margin-bottom: 20px;
    }

    .stock-info {
      margin-bottom: 20px;
    }

    .stock-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 15px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-right: 10px;
    }

    .in-stock {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .low-stock {
      background: #fff3e0;
      color: #ef6c00;
    }

    .sold-out {
      background: #ffebee;
      color: #c62828;
    }

    .quantity {
      color: #666;
    }

    .actions {
      margin-top: 20px;
    }

    .buttons {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    @media (max-width: 768px) {
      .product-detail {
        flex-direction: column;
      }

      .product-image {
        max-width: 100%;
      }
    }
  `]
})
export class ProductDetailComponent {
  @Input() product: ProductDto | null = null;
  @Input() user: User | null = null;
  @Output() actionComplete = new EventEmitter<void>();

  quantity = 1;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProductDetailComponent>
  ) {}

  isValidQuantity(): boolean {
    return this.quantity > 0 && 
           this.quantity <= (this.product?.quantityAvailable || 0);
  }

  addToCart() {
    if (!this.user || !this.product || !this.isValidQuantity()) return;

    this.userService.addToCart(
      this.user.userId,
      this.product.productId,
      this.quantity
    ).subscribe({
      next: () => {
        this.showMessage('Added to cart successfully');
        this.actionComplete.emit();
        this.dialogRef.close();
      },
      error: () => this.showMessage('Error adding to cart')
    });
  }

  buyNow() {
    if (!this.user || !this.product || !this.isValidQuantity()) return;

    this.userService.buyProduct(
      this.user.userId,
      this.product.productId,
      this.quantity
    ).subscribe({
      next: () => {
        this.showMessage('Purchase successful');
        this.actionComplete.emit();
        this.dialogRef.close();
      },
      error: () => this.showMessage('Error processing purchase')
    });
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
} 