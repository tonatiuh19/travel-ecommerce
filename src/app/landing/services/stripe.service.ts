import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromiseTest: Promise<Stripe | null>;
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromiseTest = loadStripe('');

    this.stripePromise = loadStripe(
      'pk_test_51S5zZyRqF6G0XdPCAmNBcXWUNu2brkTqu6GsJZWqQwRHrjgQQpVfSyB6yXK8FmIAF8bjrLyTgMbbhxOXpi7SUN7B005PLkL44p'
    );
  }

  async getStripe(isTesting: boolean) {
    return (await isTesting) ? this.stripePromiseTest : this.stripePromise;
  }
}
