import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return localStorage.getItem('jwt.auth') !== null;
  state.url = '/home';
};
