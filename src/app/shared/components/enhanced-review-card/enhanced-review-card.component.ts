import { Component, Input } from '@angular/core';

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  experience: string;
  date: string;
  verified: boolean;
}

@Component({
  selector: 'app-enhanced-review-card',
  templateUrl: './enhanced-review-card.component.html',
  styleUrls: ['./enhanced-review-card.component.css'],
})
export class EnhancedReviewCardComponent {
  @Input() testimonial: Testimonial = {
    id: '1',
    name: 'María González',
    location: 'Ciudad de México',
    avatar: 'https://garbrix.com/assets/img/gallery/author-1.png',
    rating: 5,
    comment:
      'Una experiencia absolutamente increíble. El servicio fue impecable desde el primer momento, la atención al detalle es excepcional y definitivamente superó todas mis expectativas. ¡Recomiendo 100%!',
    experience: 'Paquete a Tulum',
    date: '2024-01-15',
    verified: true,
  };

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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
