import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CartItem } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="orders-container">
      <h2>Order History</h2>
      
      <div class="orders-list" *ngIf="orderItems.length; else noOrders">
        <mat-card *ngFor="let item of orderItems" class="order-item">
          <img [src]="item.product?.imageUrl" [alt]="item.product?.name">
          <div class="item-details">
            <h3>{{item.product?.name}}</h3>
            <p>Quantity: {{item.quantity}}</p>
            <p class="price">₹{{item.product?.price * item.quantity}}</p>
          </div>
        </mat-card>
      </div>
      
      <ng-template #noOrders>
        <p class="empty-message">No orders found</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .order-item {
      display: flex;
      align-items: center;
      padding: 15px;
      gap: 20px;
    }
    .order-item img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }
    .item-details {
      flex: 1;
    }
    .empty-message {
      text-align: center;
      color: #666;
      font-size: 1.2rem;
      margin: 40px 0;
    }
  `]
})
export class OrdersComponent {
  @Input() boughtItems: CartItem[] = [];
  orderItems: Array<{ product: any, quantity: number }> = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadOrderItems();
  }

  private loadOrderItems() {
    this.orderItems = [];
    this.boughtItems.forEach(item => {
      this.userService.getProductById(item.prodId).subscribe({
        next: (product) => {
          this.orderItems.push({ product, quantity: item.quantity });
        }
      });
    });
  }
} 