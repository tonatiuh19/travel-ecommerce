import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public isColorDark = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.getElementById('navbar');
    const lugaresID = document.getElementById('lugaresID');
    const paquetesID = document.getElementById('paquetesID');
    const aventurasID = document.getElementById('aventurasID');

    const targetElement = document.getElementById('target-element');
    if (navbar && targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top;
      const navbarHeight = navbar.offsetHeight;

      if (targetPosition <= navbarHeight) {
        this.isColorDark = false;
        navbar.classList.add('bg-dark');
        lugaresID ? lugaresID.classList.add('text-white') : null;
        paquetesID ? paquetesID.classList.add('text-white') : null;
        aventurasID ? aventurasID.classList.add('text-white') : null;
      } else {
        this.isColorDark = true;
        navbar.classList.remove('bg-dark');
        lugaresID ? lugaresID.classList.remove('text-white') : null;
        paquetesID ? paquetesID.classList.remove('text-white') : null;
        aventurasID ? aventurasID.classList.remove('text-white') : null;
      }
    }
  }
}
