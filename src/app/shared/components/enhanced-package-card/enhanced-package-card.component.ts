import { Component, Input } from '@angular/core';

export interface EnhancedPackage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  duration: string;
  groupSize: number;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  imageUrl: string;
  gallery: string[];
  features: string[];
  highlights: string[];
  rating: number;
  reviewCount: number;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil';
  category: 'Aventura' | 'Cultural' | 'Relax' | 'Familiar' | 'Romántico';
  isPopular?: boolean;
  isNew?: boolean;
  isBestValue?: boolean;
  availability: string;
  includes: string[];
  excludes: string[];
}

@Component({
  selector: 'app-enhanced-package-card',
  templateUrl: './enhanced-package-card.component.html',
  styleUrls: ['./enhanced-package-card.component.css'],
})
export class EnhancedPackageCardComponent {
  @Input() package: EnhancedPackage = {
    id: '1',
    title: 'Aventura Mágica en Tulum',
    subtitle: 'Experiencia Maya Completa',
    description:
      'Descubre los secretos de la antigua civilización Maya en este tour exclusivo por Tulum, cenotes cristalinos y la Riviera Maya.',
    location: 'Tulum, Quintana Roo',
    duration: '3 días / 2 noches',
    groupSize: 12,
    originalPrice: 450,
    currentPrice: 320,
    discount: 29,
    imageUrl: 'https://garbrix.com/assets/img/gallery/maldives.png',
    gallery: [
      'https://garbrix.com/assets/img/gallery/agra.png',
      'https://garbrix.com/assets/img/gallery/dubai.png',
      'https://garbrix.com/assets/img/gallery/paris.png',
    ],
    features: ['Guía Certificado', 'Transporte Incluido', 'Comidas', 'Snorkel'],
    highlights: [
      'Ruinas de Tulum',
      'Cenote Dos Ojos',
      'Playa Paradisíaca',
      'Ceremonia Maya',
    ],
    rating: 4.8,
    reviewCount: 127,
    difficulty: 'Moderado',
    category: 'Aventura',
    isPopular: true,
    isBestValue: false,
    isNew: false,
    availability: 'Disponible',
    includes: [
      'Hotel 4 estrellas',
      'Todas las comidas',
      'Transporte privado',
      'Guía especializado',
    ],
    excludes: ['Vuelos', 'Propinas', 'Gastos personales'],
  };

  currentImageIndex = 0;
  isWishlisted = false;

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    if (hasHalfStar) {
      stars.push('half');
    }

    while (stars.length < 5) {
      stars.push('empty');
    }

    return stars;
  }

  nextImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % (this.package.gallery.length + 1);
  }

  previousImage(): void {
    this.currentImageIndex =
      this.currentImageIndex === 0
        ? this.package.gallery.length
        : this.currentImageIndex - 1;
  }

  getCurrentImage(): string {
    return this.currentImageIndex === 0
      ? this.package.imageUrl
      : this.package.gallery[this.currentImageIndex - 1];
  }

  toggleWishlist(): void {
    this.isWishlisted = !this.isWishlisted;
  }

  getCategoryColor(): string {
    const colors = {
      Aventura: 'bg-danger',
      Cultural: 'bg-purple',
      Relax: 'bg-success',
      Familiar: 'bg-primary',
      Romántico: 'bg-pink',
    };
    return colors[this.package.category] || 'bg-secondary';
  }

  getDifficultyColor(): string {
    const colors = {
      Fácil: 'text-success',
      Moderado: 'text-warning',
      Difícil: 'text-danger',
    };
    return colors[this.package.difficulty] || 'text-secondary';
  }
}
