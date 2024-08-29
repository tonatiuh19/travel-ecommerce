import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageImageCardComponent } from './package-image-card.component';

describe('PackageImageCardComponent', () => {
  let component: PackageImageCardComponent;
  let fixture: ComponentFixture<PackageImageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackageImageCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageImageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
