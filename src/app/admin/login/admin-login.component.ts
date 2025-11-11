import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  returnUrl = '/admin/trips';

  constructor(
    private authService: AdminAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return URL from route parameters or default to '/admin/trips'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/admin/trips';

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor ingrese usuario y contraseña';
      return;
    }

    const success = this.authService.login(this.username, this.password);

    if (success) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
      this.password = '';
    }
  }
}
