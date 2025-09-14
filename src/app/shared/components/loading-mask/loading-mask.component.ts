import { Component, Input } from '@angular/core';
import {
  faTruck,
  faTruckMoving,
  faSpinner,
  faVanShuttle,
  faBus,
  faShuttleVan,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loading-mask',
  templateUrl: './loading-mask.component.html',
  styleUrls: ['./loading-mask.component.css'],
})
export class LoadingMaskComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'Cargando...';
  @Input() fullScreen: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() iconType: 'truck' | 'van' | 'bus' | 'shuttle' = 'truck';

  // Font Awesome icons - you can customize which icon to show
  get mainIcon() {
    switch (this.iconType) {
      case 'van':
        return faVanShuttle;
      case 'bus':
        return faBus;
      case 'shuttle':
        return faShuttleVan;
      default:
        return faTruckMoving;
    }
  }

  faSpinner = faSpinner;
}
