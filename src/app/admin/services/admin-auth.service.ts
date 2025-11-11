import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('adminAuthenticated') === 'true'
  );

  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  // Mock credentials
  private readonly MOCK_USERNAME = 'admin';
  private readonly MOCK_PASSWORD = '2Thecloud!';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.MOCK_USERNAME && password === this.MOCK_PASSWORD) {
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUsername', username);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('adminAuthenticated') === 'true';
  }

  getUsername(): string | null {
    return localStorage.getItem('adminUsername');
  }
}
