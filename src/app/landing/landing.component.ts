import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromLanding } from './store/selectors';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  public selectPackages$ = this.store.select(fromLanding.selectPackages);

  public quotes: string[] = [
    'Descubre lo hermoso',
    'Descubre la belleza',
    'Descubre el mundo',
  ];

  public currentQuoteIndex: number = 0;

  constructor(private store: Store) {}

  ngOnInit() {
    this.typeQuote();
  }

  typeQuote() {
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
      quoteElement.textContent = '';
      const quote = this.quotes[this.currentQuoteIndex];
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < quote.length) {
          quoteElement.textContent += quote.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            this.currentQuoteIndex =
              (this.currentQuoteIndex + 1) % this.quotes.length;
            this.typeQuote();
          }, 2000); // Pause before typing the next quote
        }
      }, 100); // Typing speed
    }
  }
}
