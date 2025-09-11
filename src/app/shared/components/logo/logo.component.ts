import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
})
export class LogoComponent {
  @Input() width: string = '120px';
  @Input() height: string = '80px';
  @Input() color: string = '#ffffff';
  @Input() hoverColor?: string;
  @Input() scale: number = 1;
  @Input() className: string = '';

  private isHovered: boolean = false;

  constructor() {}

  get currentColor(): string {
    return this.isHovered && this.hoverColor ? this.hoverColor : this.color;
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered = false;
  }
}
