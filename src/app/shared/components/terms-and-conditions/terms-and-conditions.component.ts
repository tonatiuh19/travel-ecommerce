import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css',
})
export class TermsAndConditionsComponent {
  @Input() htmlContent: string = '';
  @Input() title: string = 'Términos y Condiciones';
  @Input() showBackButton: boolean = true;
  @Input() customCssClass: string = '';

  constructor() {}

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }

  printContent(): void {
    window.print();
  }
}
