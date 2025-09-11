import { Component, OnInit, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromLanding } from './store/selectors';
import {
  faPlane,
  faCompass,
  faMapMarkedAlt,
  faMountain,
  faVanShuttle,
  faPlay,
  faShieldAlt,
  faClock,
  faHeart,
  faDollarSign,
  faChevronDown,
  faStar,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  public selectPackages$ = this.store.select(fromLanding.selectPackages);

  // Device Detection
  public isMobile: boolean = false;
  public isTablet: boolean = false;
  public isDesktop: boolean = false;

  // FontAwesome Icons
  faPlane = faPlane;
  faCompass = faCompass;
  faMapMarkedAlt = faMapMarkedAlt;
  faMountain = faMountain;
  faVanShuttle = faVanShuttle;
  faPlay = faPlay;
  faShieldAlt = faShieldAlt;
  faClock = faClock;
  faHeart = faHeart;
  faDollarSign = faDollarSign;
  faChevronDown = faChevronDown;
  faStar = faStar;
  faHeadset = faHeadset;

  public quotes: string[] = [
    'Descubre lo hermoso',
    'Descubre la belleza',
    'Descubre el mundo',
  ];

  public currentQuoteIndex: number = 0;

  constructor(private store: Store) {}

  ngOnInit() {
    this.detectDevice();
    this.typeQuote();
    this.preventHorizontalScroll();
  }

  private preventHorizontalScroll() {
    // Apply overflow-x: hidden to body and html
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.maxWidth = '100%';
      document.body.style.maxWidth = '100%';

      // Ensure all containers don't cause horizontal scroll
      const containers = document.querySelectorAll(
        '.container, .container-fluid, .row'
      );
      containers.forEach((container) => {
        (container as HTMLElement).style.overflowX = 'hidden';
        (container as HTMLElement).style.maxWidth = '100%';
      });

      // Add a global style to prevent any element from exceeding viewport width
      const style = document.createElement('style');
      style.textContent = `
        * {
          max-width: 100vw !important;
          box-sizing: border-box !important;
        }
        
        .container, .container-fluid, .row {
          overflow-x: hidden !important;
          max-width: 100% !important;
        }
        
        [class*="col-"] {
          overflow-x: hidden;
          word-wrap: break-word;
        }

        /* Mobile-specific fixes */
        @media (max-width: 768px) {
          body, html {
            overflow-x: hidden !important;
          }
          
          .row {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.detectDevice();
    // Re-apply horizontal scroll prevention on resize
    this.preventHorizontalScroll();
  }

  detectDevice() {
    const width = window.innerWidth;

    // Mobile: < 768px
    this.isMobile = width < 768;

    // Tablet: 768px - 1024px
    this.isTablet = width >= 768 && width < 1024;

    // Desktop: >= 1024px
    this.isDesktop = width >= 1024;
  }

  typeQuote() {
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
      quoteElement.textContent = '';
      const quote = this.quotes[this.currentQuoteIndex];
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < quote.length) {
          quoteElement.textContent += quote.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            this.currentQuoteIndex =
              (this.currentQuoteIndex + 1) % this.quotes.length;
            this.typeQuote();
          }, 2000); // Pause before typing the next quote
        }
      }, 100); // Typing speed
    }
  }

  scrollToSection(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
