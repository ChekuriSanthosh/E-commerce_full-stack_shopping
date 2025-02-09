import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomePageComponent } from './home-page/home-page.component';
import { authGuard } from './auth.guard';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomePageComponent,
    resolve: {
      auth: () => {
        const authService = inject(AuthService);
        return authService.checkAuthAndRedirect();
      }
    }
  },
  { path: 'auth', component: AuthComponent },
  {path:'product',component:ProductComponent},
  { 
    path: 'home', 
    component: HomePageComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'admin/products', 
    component: ProductComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'user', 
    component: UserComponent,
    canActivate: [authGuard],
    data: { roles: ['USER'] }
  },
  { path: '**', redirectTo: '' }
];