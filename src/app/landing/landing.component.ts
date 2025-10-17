import { Component, OnInit, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromLanding } from './store/selectors';
import { LandingActions } from './store/actions';
import { MetaService } from '../shared/services/meta.service';
import { VisitorSection } from './landing.model';
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
  public selectIsLoading$ = this.store.select(fromLanding.selectIsLoading);

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

  constructor(private store: Store, private metaService: MetaService) {}

  ngOnInit() {
    this.setupMetaTags();
    this.detectDevice();
    this.typeQuote();
    this.preventHorizontalScroll();
    this.trackMainVisit();
  }

  private trackMainVisit(): void {
    this.store.dispatch(
      LandingActions.trackVisitor({ section: VisitorSection.MAIN })
    );
  }

  private setupMetaTags() {
    this.metaService.updateTags({
      title: 'Viajes Premium y Transfers VIP | Tu Destino de Ensueño',
      description:
        'Descubre destinos increíbles con nuestros paquetes de viaje premium y servicio de transfers VIP. Vehículos de lujo, conductores certificados y experiencias únicas te esperan.',
      keywords:
        'viajes premium, transfers VIP, paquetes de viaje, turismo de lujo, transporte privado, vans VIP, destinos turísticos, vacaciones, tours exclusivos',
      author: 'Travel Ecommerce Premium',
      canonical: typeof window !== 'undefined' ? window.location.href : '',
      openGraph: {
        title: 'Viajes Premium y Transfers VIP | Experiencias Únicas',
        description:
          'Servicio de transporte premium con vehículos de última generación, conductores certificados y paquetes de viaje exclusivos para destinos increíbles.',
        image: '/assets/img/back-main.jpg',
        type: 'website',
        siteName: 'Travel Ecommerce Premium',
        locale: 'es_MX',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Viajes Premium y Transfers VIP',
        description:
          'Descubre destinos increíbles con nuestro servicio premium de transfers y paquetes de viaje exclusivos.',
        image: '/assets/img/back-main.jpg',
      },
      customTags: [
        { name: 'theme-color', content: '#0066cc' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'application-name', content: 'Travel Premium' },
        { name: 'msapplication-TileColor', content: '#0066cc' },
        {
          name: 'msapplication-config',
          content: '/assets/favicons/browserconfig.xml',
        },
      ],
    });

    // Add structured data for travel agency
    this.metaService.addStructuredData({
      type: 'TravelAgency',
      data: {
        name: 'Travel Ecommerce Premium',
        description:
          'Agencia de viajes premium especializada en transfers VIP y paquetes turísticos exclusivos',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        logo: '/assets/img/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+52-555-123-4567',
          contactType: 'customer service',
          availableLanguage: ['Spanish', 'English'],
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'MX',
          addressLocality: 'Ciudad de México',
        },
        sameAs: [
          'https://facebook.com/travelpremium',
          'https://instagram.com/travelpremium',
          'https://twitter.com/travelpremium',
        ],
      },
    });

    // Add structured data for services
    this.metaService.addStructuredData({
      type: 'Service',
      data: {
        serviceType: 'Transportation Service',
        name: 'Transfers VIP Premium',
        description:
          'Servicio de transporte privado de lujo con vehículos premium, conductores certificados y atención 24/7',
        provider: {
          '@type': 'TravelAgency',
          name: 'Travel Ecommerce Premium',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Mexico',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Servicios de Transfer',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Transfer Aeropuerto',
              description: 'Servicio de transfer desde y hacia aeropuertos',
            },
            {
              '@type': 'Offer',
              name: 'Transfer Turístico',
              description:
                'Transporte a destinos turísticos y lugares de interés',
            },
            {
              '@type': 'Offer',
              name: 'Transfer VIP',
              description:
                'Servicio premium con vehículos de lujo y amenidades especiales',
            },
          ],
        },
      },
    });
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
      // Track section visits
      if (elementId === 'van-transfers') {
        this.store.dispatch(
          LandingActions.trackVisitor({ section: VisitorSection.PACKAGE_LIST })
        );
      }

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
