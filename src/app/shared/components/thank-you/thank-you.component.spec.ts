import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouComponent } from './thank-you.component';

describe('ThankYouComponent', () => {
  let component: ThankYouComponent;
  let fixture: ComponentFixture<ThankYouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThankYouComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThankYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate confirmation number', () => {
    component.paymentSuccessful = true;
    const confirmationNumber = component.generateConfirmationNumber();
    expect(confirmationNumber).toMatch(/^VIP\d{10}$/);
  });

  it('should generate error number for failed payment', () => {
    component.paymentSuccessful = false;
    const errorNumber = component.generateConfirmationNumber();
    expect(errorNumber).toMatch(/^ERR\d{10}$/);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(123.45);
    expect(formatted).toBe('€123');
  });

  it('should format date correctly', () => {
    const date = '2024-12-25';
    const formatted = component.formatDate(date);
    expect(formatted).toContain('2024');
  });

  it('should emit closed event', () => {
    spyOn(component.closed, 'emit');
    component.close();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit downloadConfirmation event', () => {
    spyOn(component.downloadConfirmation, 'emit');
    component.onDownloadConfirmation();
    expect(component.downloadConfirmation.emit).toHaveBeenCalled();
  });

  it('should emit tryAgain event', () => {
    spyOn(component.tryAgain, 'emit');
    component.onTryAgain();
    expect(component.tryAgain.emit).toHaveBeenCalled();
  });
});
