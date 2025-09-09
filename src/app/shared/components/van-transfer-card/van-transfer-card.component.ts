import { Component, Input } from '@angular/core';
import {
  faCrown,
  faStar,
  faUsers,
  faClock,
  faRoute,
  faCheckCircle,
  faCalendarCheck,
  faInfoCircle,
  faHeart,
  faShare,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

export interface VanTransfer {
  id: string;
  title: string;
  description: string;
  route: string;
  duration: string;
  capacity: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  features: string[];
  rating: number;
  isLuxury?: boolean;
  isPopular?: boolean;
}

@Component({
  selector: 'app-van-transfer-card',
  templateUrl: './van-transfer-card.component.html',
  styleUrls: ['./van-transfer-card.component.css'],
})
export class VanTransferCardComponent {
  @Input() transfer: VanTransfer = {
    id: '1',
    title: 'Transfer Premium Aeropuerto',
    description:
      'Servicio de traslado cómodo y seguro desde/hacia el aeropuerto con van de lujo',
    route: 'Aeropuerto ↔ Centro de la Ciudad',
    duration: '45 min',
    capacity: 8,
    price: 85,
    originalPrice: 120,
    discount: 29,
    imageUrl: 'https://garbrix.com/assets/img/gallery/boutique-hotel.png',
    features: ['WiFi Gratis', 'A/C', 'Conductor Profesional', 'Agua Incluida'],
    rating: 4.8,
    isLuxury: true,
    isPopular: true,
  };

  // FontAwesome Icons
  faCrown = faCrown;
  faStar = faStar;
  faUsers = faUsers;
  faClock = faClock;
  faRoute = faRoute;
  faCheckCircle = faCheckCircle;
  faCalendarCheck = faCalendarCheck;
  faInfoCircle = faInfoCircle;
  faHeart = faHeart;
  faShare = faShare;
  faEye = faEye;

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
}
