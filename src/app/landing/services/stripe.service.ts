import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromiseTest: Promise<Stripe | null>;
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromiseTest = loadStripe(
      'pk_test_51S5zZyRqF6G0XdPCAmNBcXWUNu2brkTqu6GsJZWqQwRHrjgQQpVfSyB6yXK8FmIAF8bjrLyTgMbbhxOXpi7SUN7B005PLkL44p'
    );

    this.stripePromise = loadStripe(
      'pk_live_51S5zZq2OM2B9pYuKWyFG00CU9NX9pvf83krYT0PpglGRoSD1Pn01ur4SnycQwovSzrPW5YrP3geGwfC4oyGXb3B300zkP3rAM5'
    );
  }

  async getStripe(isTesting: boolean) {
    return (await isTesting) ? this.stripePromiseTest : this.stripePromise;
  }
}
