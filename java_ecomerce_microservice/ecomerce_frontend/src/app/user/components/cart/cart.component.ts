import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, ProductDto } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="cart-container">
  <h2>Shopping Cart</h2>
  <div class="cart-total">Total: ₹{{cartTotal}}</div>
  
  <div class="cart-items" *ngIf="user?.cartItems?.length; else emptyCart">
    <mat-card *ngFor="let item of cartItems" class="cart-item">
    <img [src]="item.product.imageUrl" [alt]="item.product.name">
<h3>{{item.product.name}}</h3>
<p class="price">₹{{item.product.price * item.quantity}}</p>

        
        <div class="quantity-controls">
          <button mat-icon-button (click)="changeQuantity(item, -1)">
            <mat-icon>remove</mat-icon>
          </button>
          <span>{{item.quantity}}</span>
          <button mat-icon-button (click)="changeQuantity(item, 1)">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      <div class="item-actions">
        <button mat-icon-button color="warn" (click)="removeFromCart(item)">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </mat-card>
  </div>
  
  <ng-template #emptyCart>
    <p class="empty-message">Your cart is empty</p>
  </ng-template>

  <div class="cart-actions" *ngIf="user?.cartItems?.length">
    <button mat-raised-button color="warn" (click)="clearCart()" class="clear-cart">Clear Cart</button>
    <button mat-raised-button color="primary" (click)="checkout()" class="checkout">Checkout</button>
  </div>
</div>
  `,
  styles: [`
    .cart-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9; /* Light background for the entire cart */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.cart-total {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: right;
  margin: 20px 0;
  color: #1e3c72;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 20px;
  background-color: #ffffff; /* White background for each product */
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.cart-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  background-color: #e0e0e0; /* Light gray for quantity buttons */
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;
}

.quantity-controls button:hover {
  background-color: #d5d5d5; /* Darker gray on hover */
  transform: translateY(-2px);
}

.empty-message {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin: 40px 0;
}

.cart-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}

button.mat-raised-button {
  background-color: #4caf50; /* Green for checkout */
  color: white;
}

button.mat-raised-button:hover {
  background-color: #45a049; /* Darker green on hover */
}

button.mat-icon-button {
  background-color: #f44336; /* Red for delete */
  color: white;
}

button.mat-icon-button:hover {
  background-color: #e53935; /* Darker red on hover */
}

.clear-cart {
  background-color: #ff9800; /* Orange for clear cart */
  color: white;
}

.clear-cart:hover {
  background-color: #fb8c00; /* Darker orange on hover */
}

.checkout {
  background-color: #4caf50; /* Green for checkout */
  color: white;
}

.checkout:hover {
  background-color: #45a049; /* Darker green on hover */
}
  `]
})
export class CartComponent {
  @Input() user: User | null = null;
  @Output() cartUpdated = new EventEmitter<void>();
  
  cartItems: Array<{ product: ProductDto, quantity: number }> = [];
  cartTotal = 0;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  private loadCartItems() {
    if (!this.user) return;
    
    // Load cart items and their details
    this.cartItems = [];
    this.user.cartItems.forEach(item => {
      this.userService.getProductById(item.prodId).subscribe({
        next: (product) => {
          this.cartItems.push({ product, quantity: item.quantity });
          this.updateCartTotal();
        }
      });
    });
  }

  private updateCartTotal() {
    this.cartTotal = this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity), 0
    );
  }

  removeFromCart(item: { product: ProductDto, quantity: number }) {
    if (!this.user) return;
    
    this.userService.removeFromCart(this.user.userId, item.product.productId).subscribe({
      next: () => {
        this.showMessage('Item removed from cart');
        this.cartUpdated.emit();
      },
      error: () => this.showMessage('Error removing item from cart')
    });
  }

  clearCart() {
    if (!this.user) return;
    
    this.userService.clearCart(this.user.userId).subscribe({
      next: () => {
        this.showMessage('Cart cleared');
        this.cartUpdated.emit();
      },
      error: () => this.showMessage('Error clearing cart')
    });
  }

  checkout() {
    // Implement checkout logic
    this.showMessage('Checkout functionality coming soon!');
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  changeQuantity(item: { product: ProductDto, quantity: number }, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    item.quantity = newQuantity;
    this.updateCartTotal();
  }

} 