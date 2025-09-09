import { Component, OnInit } from '@angular/core';
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faHeart,
  faPaperPlane,
  faArrowUp,
  faGlobe,
  faShieldAlt,
  faAward,
  faClock,
  faShare,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-enhanced-footer',
  templateUrl: './enhanced-footer.component.html',
  styleUrl: './enhanced-footer.component.css',
})
export class EnhancedFooterComponent implements OnInit {
  // Social media placeholder (we'll use generic icons)
  faShare = faShare;

  // Solid icons
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faMapMarkerAlt = faMapMarkerAlt;
  faHeart = faHeart;
  faPaperPlane = faPaperPlane;
  faArrowUp = faArrowUp;
  faGlobe = faGlobe;
  faShieldAlt = faShieldAlt;
  faAward = faAward;
  faClock = faClock;

  currentYear = new Date().getFullYear();
  newsletterEmail = '';

  // Quick links
  quickLinks = [
    { label: 'Inicio', href: '#top' },
    { label: 'Transfers VIP', href: '#van-transfers' },
    { label: 'Destinos', href: '#destinations' },
    { label: 'Paquetes', href: '#packages' },
    { label: 'Testimonios', href: '#testimonials' },
    { label: 'Contacto', href: '#contact' },
  ];

  // Services
  services = [
    { label: 'Transfer Aeropuerto', href: '#' },
    { label: 'Tours Privados', href: '#' },
    { label: 'Excursiones VIP', href: '#' },
    { label: 'Servicios Corporativos', href: '#' },
    { label: 'Eventos Especiales', href: '#' },
    { label: 'Bodas & Celebraciones', href: '#' },
  ];

  // Company info
  companyInfo = [
    { label: 'Acerca de Nosotros', href: '#' },
    { label: 'Nuestra Historia', href: '#' },
    { label: 'Términos y Condiciones', href: '#' },
    { label: 'Política de Privacidad', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Carreras', href: '#' },
  ];

  // Contact info
  contactInfo = {
    phone: '+1 (555) 123-4567',
    email: 'info@travelvip.com',
    address: '123 Travel Street, Adventure City, AC 12345',
    hours: 'Lun - Dom: 24/7 Atención',
  };

  ngOnInit() {
    // Initialize any animations or dynamic content
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  subscribeNewsletter() {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      // Handle newsletter subscription
      console.log('Newsletter subscription:', this.newsletterEmail);
      // Show success message
      this.showNotification('¡Gracias por suscribirte!', 'success');
      this.newsletterEmail = '';
    } else {
      this.showNotification('Por favor ingresa un email válido', 'error');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showNotification(message: string, type: 'success' | 'error') {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  navigateToLink(href: string) {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else {
      window.open(href, '_blank');
    }
  }
}
