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
  selector: 'app-enhanced-hero',
  templateUrl: './enhanced-hero.component.html',
  styleUrl: './enhanced-hero.component.css',
})
export class EnhancedHeroComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoBackground', { static: false })
  videoRef!: ElementRef<HTMLVideoElement>;

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

  // Dynamic content
  public heroTexts: string[] = [
    'Explora Destinos Únicos',
    'Vive Aventuras Extraordinarias',
    'Descubre el Mundo Sin Límites',
    'Crea Recuerdos Inolvidables',
  ];

  public currentTextIndex = 0;
  public currentText = '';
  public isTyping = true;
  public typewriterInterval: any;

  // Mobile detection
  public isMobile: boolean = false;

  // Particle animation
  public particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }> = [];
  public animationFrameId: any;

  // Statistics counter
  public stats = [
    {
      icon: this.faUsers,
      number: 0,
      target: 25000,
      suffix: '+',
      label: 'Viajeros Felices',
      increment: 250,
    },
    {
      icon: this.faLocationDot,
      number: 0,
      target: 500,
      suffix: '+',
      label: 'Destinos',
      increment: 5,
    },
    {
      icon: this.faStar,
      number: 0,
      target: 4.9,
      suffix: '',
      label: 'Rating ⭐',
      increment: 0.1,
    },
    {
      icon: this.faAward,
      number: 0,
      target: 15,
      suffix: '',
      label: 'Años Experiencia',
      increment: 1,
    },
  ];

  private observer!: IntersectionObserver;

  ngOnInit() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    this.startTypewriter();
    this.initParticles();
    this.animateParticles();
    this.initScrollObserver();

    // Disable zoom on mobile
    if (this.isMobile) {
      this.disableZoom();
    }
  }

  ngAfterViewInit() {
    // Initialize video if available
    if (this.videoRef?.nativeElement) {
      this.videoRef.nativeElement.playbackRate = 0.5;
    }
  }

  ngOnDestroy() {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.observer) {
      this.observer.disconnect();
    }

    // Re-enable zoom on mobile
    if (this.isMobile) {
      this.enableZoom();
    }
  }

  // Mobile detection method
  checkMobile() {
    this.isMobile = window.innerWidth <= 991.98;
  }

  // Zoom prevention methods for mobile
  private disableZoom(): void {
    let viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }

    if (!viewport.getAttribute('data-original-content')) {
      viewport.setAttribute('data-original-content', viewport.content || '');
    }

    viewport.content =
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.body.style.touchAction = 'manipulation';
  }

  private enableZoom(): void {
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
    document.body.style.touchAction = 'auto';
  }

  startTypewriter() {
    let charIndex = 0;
    const currentFullText = this.heroTexts[this.currentTextIndex];

    this.typewriterInterval = setInterval(() => {
      if (this.isTyping) {
        if (charIndex <= currentFullText.length) {
          this.currentText = currentFullText.substring(0, charIndex);
          charIndex++;
        } else {
          this.isTyping = false;
          setTimeout(() => {
            this.isTyping = true;
            charIndex = currentFullText.length;
          }, 2000);
        }
      } else {
        if (charIndex >= 0) {
          this.currentText = currentFullText.substring(0, charIndex);
          charIndex--;
        } else {
          this.currentTextIndex =
            (this.currentTextIndex + 1) % this.heroTexts.length;
          this.isTyping = true;
          charIndex = 0;
        }
      }
    }, 100);
  }

  initParticles() {
    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animateParticles() {
    const canvas = document.getElementById(
      'particleCanvas'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(157, 180, 194, ${particle.opacity})`;
        ctx.fill();
      });

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  initScrollObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      this.observer.observe(statsSection);
    }
  }

  animateCounters() {
    this.stats.forEach((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        if (stat.target === 4.9) {
          stat.number = Math.min(stat.target, progress * stat.target);
        } else {
          stat.number = Math.floor(progress * stat.target);
        }

        if (currentStep >= steps) {
          stat.number = stat.target;
          clearInterval(timer);
        }
      }, stepTime);
    });
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

  openVideoModal() {
    // Open video modal logic
    const modal = document.getElementById('videoModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }
}
