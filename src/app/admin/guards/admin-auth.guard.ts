import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated =
      localStorage.getItem('adminAuthenticated') === 'true';

    if (isAuthenticated) {
      return true;
    }

    // Redirect to login page
    this.router.navigate(['/admin/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
