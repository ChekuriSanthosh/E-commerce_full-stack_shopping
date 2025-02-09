import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip interceptor for auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = localStorage.getItem('jwt.auth');
  
  // Validate token format before using it
  if (token && token.split('.').length === 3) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  // If token is invalid, proceed without it
  return next(req);
};
