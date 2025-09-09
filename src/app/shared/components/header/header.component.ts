import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() isMain = true;
  public isColorDark = true;
  public isLogoSmall = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.getElementById('navbar');

    const targetElement = document.getElementById('van-transfers');

    if (this.isMain) {
      if (navbar && targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top;
        const navbarHeight = navbar.offsetHeight;

        if (targetPosition <= navbarHeight) {
          this.isColorDark = false;
          this.isLogoSmall = true;
          navbar.classList.add('bg-primary');
        } else {
          this.isColorDark = true;
          this.isLogoSmall = false;
          navbar.classList.remove('bg-primary');
        }
      }
    } else {
      navbar ? navbar.classList.add('bg-primary') : null;
    }
  }
}
