import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  faCouch,
  faShieldAlt,
  faMapMarkedAlt,
  faPlayCircle,
  faArrowRight,
  faCalendarCheck,
  faPhone,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';

interface VideoInfo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  icon: string;
  stats: string;
}

@Component({
  selector: 'app-video-info-section',
  templateUrl: './video-info-section.component.html',
  styleUrls: ['./video-info-section.component.css'],
})
export class VideoInfoSectionComponent implements OnInit, OnDestroy {
  showVideos: boolean = true;
  connectionSpeed: number = 0;

  // FontAwesome Icons
  faCouch = faCouch;
  faShieldAlt = faShieldAlt;
  faMapMarkedAlt = faMapMarkedAlt;
  faPlayCircle = faPlayCircle;
  faArrowRight = faArrowRight;
  faCalendarCheck = faCalendarCheck;
  faPhone = faPhone;
  faWifi = faWifi;

  videoInfoItems: VideoInfo[] = [
    {
      id: 'comfort',
      title: 'Máximo Confort',
      description:
        'Vehículos de lujo equipados con todas las comodidades para tu viaje. Asientos de cuero, climatización, WiFi y entretenimiento a bordo.',
      videoUrl:
        'https://garbrix.com/latinosporeuropa/assets/videos/confort.mp4',
      imageUrl:
        'https://garbrix.com/latinosporeuropa/assets/images/confort.jpg',
      icon: 'faCouch',
      stats: '98% satisfacción',
    },
    {
      id: 'safety',
      title: 'Seguridad Total',
      description:
        'Conductores certificados con años de experiencia. Vehículos inspeccionados regularmente y seguro completo para tu tranquilidad.',
      videoUrl:
        'https://garbrix.com/latinosporeuropa/assets/videos/security.mp4',
      imageUrl:
        'https://garbrix.com/latinosporeuropa/assets/images/security.jpg',
      icon: 'faShieldAlt',
      stats: '0 accidentes en 2024',
    },
    {
      id: 'destinations',
      title: 'Destinos Exclusivos',
      description:
        'Acceso a más de 200 destinos únicos. Rutas panorámicas, lugares secretos y experiencias que solo nosotros podemos ofrecerte.',
      videoUrl:
        'https://garbrix.com/latinosporeuropa/assets/videos/exclusive.mp4',
      imageUrl:
        'https://garbrix.com/latinosporeuropa/assets/images/exclusive.jpg',
      icon: 'faMapMarkedAlt',
      stats: '200+ destinos',
    },
  ];

  ngOnInit(): void {
    this.checkConnectionSpeed();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private checkConnectionSpeed(): void {
    // Simple connection speed detection
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      // If effective connection type is slow, show images instead
      const slowConnections = ['slow-2g', '2g', '3g'];
      this.showVideos = !slowConnections.includes(connection.effectiveType);
    } else {
      // Fallback: test with a small image download
      this.testConnectionSpeed();
    }
  }

  private testConnectionSpeed(): void {
    const imageAddr =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const downloadSize = 1024; // 1KB test

    const download = new Image();
    const startTime = Date.now();

    download.onload = () => {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // in seconds
      const bitsLoaded = downloadSize * 8;
      const speedBps = bitsLoaded / duration;
      const speedKbps = speedBps / 1024;

      // If speed is less than 500 Kbps, show images instead of videos
      this.showVideos = speedKbps > 500;
    };

    download.onerror = () => {
      // On error, default to images for safety
      this.showVideos = false;
    };

    download.src = imageAddr;
  }

  onVideoError(videoId: string): void {
    console.log(`Video failed to load for ${videoId}, showing image fallback`);
    // You could implement per-video fallback logic here if needed
  }

  onVideoLoaded(videoId: string): void {
    console.log(`Video loaded successfully for ${videoId}`);
  }

  getIcon(iconName: string): any {
    const iconMap: { [key: string]: any } = {
      faCouch: this.faCouch,
      faShieldAlt: this.faShieldAlt,
      faMapMarkedAlt: this.faMapMarkedAlt,
    };
    return iconMap[iconName];
  }
}
