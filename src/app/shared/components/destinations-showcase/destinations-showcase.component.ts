import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  faMapMarkedAlt,
  faMapMarker,
  faPlay,
  faRoute,
  faUserTie,
  faCamera,
  faHeart,
  faClock,
  faUsers,
  faVanShuttle,
  faStar,
  faCalendarCheck,
  faInfoCircle,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

interface DestinationInfo {
  id: string;
  city: string;
  country: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  highlights: string[];
  price: string;
  duration: string;
}

@Component({
  selector: 'app-destinations-showcase',
  templateUrl: './destinations-showcase.component.html',
  styleUrls: ['./destinations-showcase.component.css'],
})
export class DestinationsShowcaseComponent implements OnInit, OnDestroy {
  showVideos: boolean = true;
  connectionSpeed: number = 0;

  // FontAwesome Icons
  faMapMarkedAlt = faMapMarkedAlt;
  faMapMarker = faMapMarker;
  faPlay = faPlay;
  faRoute = faRoute;
  faUserTie = faUserTie;
  faCamera = faCamera;
  faHeart = faHeart;
  faClock = faClock;
  faUsers = faUsers;
  faVanShuttle = faVanShuttle;
  faStar = faStar;
  faCalendarCheck = faCalendarCheck;
  faInfoCircle = faInfoCircle;
  faImage = faImage;

  destinations: DestinationInfo[] = [
    {
      id: 'paris',
      city: 'París',
      country: 'Francia',
      title: 'La Ciudad del Amor',
      description:
        'Descubre la magia de París con nuestros transfers VIP. Torre Eiffel, Louvre, Campos Elíseos y los rincones más románticos de la capital francesa te esperan.',
      videoUrl: 'https://garbrix.com/latinosporeuropa/assets/videos/video1.mp4',
      imageUrl: 'https://garbrix.com/latinosporeuropa/assets/images/paris.jpg',
      highlights: [
        'Torre Eiffel',
        'Museo del Louvre',
        'Campos Elíseos',
        'Montmartre',
      ],
      price: 'Desde €45',
      duration: 'Desde 4 horas',
    },
    {
      id: 'amsterdam',
      city: 'Ámsterdam',
      country: 'Países Bajos',
      title: 'Canales y Cultura',
      description:
        'Explora los famosos canales de Ámsterdam y su rica cultura. Museos, barrios históricos y la vibrante vida nocturna holandesa en un viaje inolvidable.',
      videoUrl: 'https://garbrix.com/latinosporeuropa/assets/videos/video2.mp4',
      imageUrl:
        'https://garbrix.com/latinosporeuropa/assets/images/amsterdam.jpg',
      highlights: [
        'Canales Históricos',
        'Museo Van Gogh',
        'Barrio Rojo',
        'Vondelpark',
      ],
      price: 'Desde €40',
      duration: 'Todo el dia (solo ida)',
    },
    {
      id: 'bruges',
      city: 'Brujas',
      country: 'Bélgica',
      title: 'Perla Medieval',
      description:
        'Viaja en el tiempo en Brujas, la ciudad medieval mejor conservada de Europa. Canales pintorescos, arquitectura gótica y el mejor chocolate belga.',
      videoUrl: 'https://garbrix.com/latinosporeuropa/assets/videos/video3.mp4',
      imageUrl: 'https://garbrix.com/latinosporeuropa/assets/images/bruges.jpg',
      highlights: [
        'Centro Medieval',
        'Campanario de Brujas',
        'Canales Románticos',
        'Chocolaterías',
      ],
      price: 'Desde €35',
      duration: 'Todo el dia',
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

  onVideoError(destinationId: string): void {
    console.log(
      `Video failed to load for ${destinationId}, showing image fallback`
    );
  }

  onVideoLoaded(destinationId: string): void {
    console.log(`Video loaded successfully for ${destinationId}`);
  }

  bookDestination(destination: DestinationInfo): void {
    console.log(`Booking destination: ${destination.city}`);

    // Scroll to the van-transfers section
    const vanTransferSection = document.getElementById('van-transfers');
    if (vanTransferSection) {
      vanTransferSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
