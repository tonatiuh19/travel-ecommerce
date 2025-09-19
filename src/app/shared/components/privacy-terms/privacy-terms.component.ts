import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-terms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-terms.component.html',
  styleUrls: ['./privacy-terms.component.css'],
})
export class PrivacyTermsComponent {
  @Input() htmlContent: string = '';
  @Input() title: string = 'Política de Privacidad';
  @Input() showBackButton: boolean = true;
  @Input() customCssClass: string = '';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  printContent(): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${this.title}</title>
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                padding: 40px; 
                line-height: 1.7;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
              }
              h1, h2, h3, h4, h5, h6 { 
                color: #112D35; 
                margin-top: 2rem; 
                margin-bottom: 1rem; 
                font-weight: 600;
              }
              h1 { 
                font-size: 1.8rem; 
                border-bottom: 2px solid #BB6557; 
                padding-bottom: 0.5rem; 
              }
              p { 
                margin-bottom: 1.2rem; 
                text-align: justify; 
              }
              ul, ol { 
                padding-left: 2rem; 
                margin-bottom: 1.2rem; 
              }
              li { 
                margin-bottom: 0.5rem; 
              }
              strong { 
                color: #112D35; 
                font-weight: 600; 
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 1.5rem 0; 
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 0.75rem; 
                text-align: left; 
              }
              th { 
                background: #A5C2D2; 
                color: #112D35; 
                font-weight: 600; 
              }
              blockquote { 
                border-left: 4px solid #BB6557; 
                padding: 1rem; 
                margin: 1.5rem 0; 
                background: rgba(187, 101, 87, 0.05); 
                border-radius: 0 8px 8px 0; 
              }
              @media print {
                body { padding: 20px; }
                h1, h2, h3 { page-break-after: avoid; }
                p, li { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <h1>${this.title}</h1>
            ${this.htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  onContentClick(event: Event): void {
    // Handle clicks on links within the HTML content
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href && (href.startsWith('http') || href.startsWith('https'))) {
        event.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
