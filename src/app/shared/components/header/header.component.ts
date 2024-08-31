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

    const targetElement = document.getElementById('target-element');
    if (navbar && targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top;
      const navbarHeight = navbar.offsetHeight;

      if (targetPosition <= navbarHeight) {
        this.isColorDark = false;
        navbar.classList.add('bg-dark');
      } else {
        this.isColorDark = true;
        navbar.classList.remove('bg-dark');
      }
    }
  }
}
