import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingMaskComponent } from './loading-mask.component';

describe('LoadingMaskComponent', () => {
  let component: LoadingMaskComponent;
  let fixture: ComponentFixture<LoadingMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingMaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden by default', () => {
    expect(component.isVisible).toBeFalsy();
  });

  it('should show default message', () => {
    expect(component.message).toBe('Cargando...');
  });

  it('should be full screen by default', () => {
    expect(component.fullScreen).toBeTruthy();
  });

  it('should have medium size by default', () => {
    expect(component.size).toBe('medium');
  });

  it('should render when visible', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-mask')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    component.isVisible = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-mask')).toBeFalsy();
  });

  it('should display custom message', () => {
    component.isVisible = true;
    component.message = 'Custom loading message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-message')?.textContent).toContain(
      'Custom loading message'
    );
  });
});
