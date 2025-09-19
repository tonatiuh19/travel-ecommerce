import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
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
  faGlobe,
  faRocket,
  faCamera,
  faRoute,
  faLocationDot,
  faArrowRight,
  faCheck,
  faUsers,
  faAward,
  faInfinity,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mobile-enhanced-hero',
  templateUrl: './mobile-enhanced-hero.component.html',
  styleUrl: './mobile-enhanced-hero.component.css',
})
export class MobileEnhancedHeroComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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
  faGlobe = faGlobe;
  faRocket = faRocket;
  faCamera = faCamera;
  faRoute = faRoute;
  faLocationDot = faLocationDot;
  faArrowRight = faArrowRight;
  faCheck = faCheck;
  faUsers = faUsers;
  faAward = faAward;
  faInfinity = faInfinity;

  // Typewriter animation properties
  texts = ['Comienza Aquí', 'Explora Destinos', 'Vive Experiencias'];
  currentText = '';
  currentIndex = 0;
  isTyping = false;
  typewriterInterval: any;

  // Animation properties
  private intersectionObserver?: IntersectionObserver;

  // Statistics data
  stats = [
    {
      number: 4.9,
      target: 4.9,
      suffix: '★',
      label: 'Calificación Promedio',
      icon: faStar,
    },
    {
      number: 15,
      target: 15,
      suffix: ' años',
      label: 'De Experiencia',
      icon: faAward,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.disableZoom(); // Prevent double-tap zoom on mobile
    this.startTypewriter();
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
  }

  ngOnDestroy(): void {
    this.enableZoom(); // Restore zoom functionality
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  // Zoom prevention methods
  private disableZoom(): void {
    // Get or create viewport meta tag
    let viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }

    // Store original content to restore later
    if (!viewport.getAttribute('data-original-content')) {
      viewport.setAttribute('data-original-content', viewport.content || '');
    }

    // Set content to disable zoom
    viewport.content =
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

    // Prevent double-tap zoom with touch-action
    document.body.style.touchAction = 'manipulation';
  }

  private enableZoom(): void {
    // Restore original viewport content
    const viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (viewport) {
      const originalContent = viewport.getAttribute('data-original-content');
      if (originalContent) {
        viewport.content = originalContent;
      } else {
        viewport.content = 'width=device-width, initial-scale=1.0';
      }
    }

    // Restore body touch-action
    document.body.style.touchAction = 'auto';
  }

  private startTypewriter(): void {
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseTime = 2000;

    const type = () => {
      this.isTyping = true;
      const current = this.texts[this.currentIndex];

      if (isDeleting) {
        this.currentText = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        this.currentText = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === current.length) {
        nextDelay = pauseTime;
        isDeleting = true;
        this.isTyping = false;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        this.currentIndex = (this.currentIndex + 1) % this.texts.length;
        nextDelay = typeSpeed;
      }

      this.typewriterInterval = setTimeout(type, nextDelay);
    };

    type();
  }

  private initializeAnimations(): void {
    // Animate stats on scroll
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateStats();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsElement = document.querySelector('.stats-container');
    if (statsElement) {
      this.intersectionObserver.observe(statsElement);
    }
  }

  private animateStats(): void {
    this.stats.forEach((stat, index) => {
      this.animateValue(stat, 2000 + index * 200);
    });
  }

  private animateValue(stat: any, duration: number): void {
    let startTime: number;
    const startValue = 0;
    const endValue = stat.target;

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      if (stat.target === 4.9) {
        stat.number = startValue + progress * (endValue - startValue);
      } else {
        stat.number = Math.floor(
          startValue + progress * (endValue - startValue)
        );
      }

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openVideoModal(): void {
    // Bootstrap modal trigger
    const modalElement = document.getElementById('videoModal');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }
}
