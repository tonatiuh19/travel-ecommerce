import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  forwardRef,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  faPhone,
  faGlobe,
  faChevronDown,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

export interface CountryCode {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export interface PhoneValue {
  countryCode: string;
  phoneNumber: string;
  fullNumber: string;
  isValid: boolean;
}

@Component({
  selector: 'app-phone-input-picker',
  templateUrl: './phone-input-picker.component.html',
  styleUrls: ['./phone-input-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputPickerComponent),
      multi: true,
    },
  ],
})
export class PhoneInputPickerComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() placeholder: string = 'Número de teléfono';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() label: string = '';
  @Input() errorMessage: string = '';
  @Input() showValidation: boolean = true;

  @Output() phoneChange = new EventEmitter<PhoneValue>();
  @Output() validationChange = new EventEmitter<boolean>();

  // FontAwesome Icons
  faPhone = faPhone;
  faGlobe = faGlobe;
  faChevronDown = faChevronDown;
  faCheck = faCheck;

  // Component state
  selectedCountry: CountryCode = {
    name: 'España',
    code: 'ES',
    dialCode: '+34',
    flag: '🇪🇸',
  }; // Default to Spain
  phoneNumber: string = '';
  isDropdownOpen: boolean = false;
  filteredCountries: CountryCode[] = [];
  searchQuery: string = '';
  isValid: boolean = false;
  isTouched: boolean = false;

  // Available country codes with their dial codes
  countries: CountryCode[] = [
    { name: 'España', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
    { name: 'Francia', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
    { name: 'Estados Unidos', code: 'US', dialCode: '+1', flag: '🇺🇸' },
    { name: 'México', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
    { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷' },
    { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴' },
    { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱' },
    { name: 'Perú', code: 'PE', dialCode: '+51', flag: '🇵🇪' },
    { name: 'Brasil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
    { name: 'Venezuela', code: 'VE', dialCode: '+58', flag: '🇻🇪' },
    { name: 'Ecuador', code: 'EC', dialCode: '+593', flag: '🇪🇨' },
    { name: 'Uruguay', code: 'UY', dialCode: '+598', flag: '🇺🇾' },
    { name: 'Paraguay', code: 'PY', dialCode: '+595', flag: '🇵🇾' },
    { name: 'Bolivia', code: 'BO', dialCode: '+591', flag: '🇧🇴' },
    { name: 'Guatemala', code: 'GT', dialCode: '+502', flag: '🇬🇹' },
    { name: 'Costa Rica', code: 'CR', dialCode: '+506', flag: '🇨🇷' },
    { name: 'Panamá', code: 'PA', dialCode: '+507', flag: '🇵🇦' },
    { name: 'El Salvador', code: 'SV', dialCode: '+503', flag: '🇸🇻' },
    { name: 'Honduras', code: 'HN', dialCode: '+504', flag: '🇭🇳' },
    { name: 'Nicaragua', code: 'NI', dialCode: '+505', flag: '🇳🇮' },
    { name: 'República Dominicana', code: 'DO', dialCode: '+1', flag: '🇩🇴' },
    { name: 'Puerto Rico', code: 'PR', dialCode: '+1', flag: '🇵🇷' },
    { name: 'Alemania', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
    { name: 'Reino Unido', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
    { name: 'Italia', code: 'IT', dialCode: '+39', flag: '🇮🇹' },
    { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹' },
    { name: 'Holanda', code: 'NL', dialCode: '+31', flag: '🇳🇱' },
    { name: 'Bélgica', code: 'BE', dialCode: '+32', flag: '🇧🇪' },
    { name: 'Canadá', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
    { name: 'Japón', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
    { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
  ];

  // ControlValueAccessor implementation
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.filteredCountries = [...this.countries];
    // Ensure selectedCountry is properly set after countries array is ready
    this.selectedCountry = this.getDefaultCountry();
  }

  ngOnDestroy(): void {
    // Close dropdown on component destroy
    this.isDropdownOpen = false;
  }

  private getDefaultCountry(): CountryCode {
    if (!this.countries || this.countries.length === 0) {
      return { name: 'España', code: 'ES', dialCode: '+34', flag: '🇪🇸' };
    }
    return this.countries.find((c) => c.code === 'ES') || this.countries[0];
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value) {
      if (typeof value === 'string') {
        // Handle string value (full phone number)
        this.parseFullPhoneNumber(value);
      } else if (value.countryCode && value.phoneNumber) {
        // Handle object value
        const country = this.countries.find(
          (c) => c.dialCode === value.countryCode
        );
        if (country) {
          this.selectedCountry = country;
        }
        this.phoneNumber = value.phoneNumber;
      }
      this.validatePhone();
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Phone number parsing for existing values
  private parseFullPhoneNumber(fullNumber: string): void {
    const cleanNumber = fullNumber.replace(/\s+/g, '');

    // Try to match with country codes
    for (const country of this.countries) {
      if (cleanNumber.startsWith(country.dialCode)) {
        this.selectedCountry = country;
        this.phoneNumber = cleanNumber.substring(country.dialCode.length);
        return;
      }
    }

    // If no country code match, assume it's just the phone number
    this.phoneNumber = cleanNumber;
  }

  // Country selection methods
  toggleDropdown(): void {
    if (!this.disabled) {
      this.isDropdownOpen = !this.isDropdownOpen;
      this.searchQuery = '';
      this.filteredCountries = [...this.countries];
    }
  }

  selectCountry(country: CountryCode): void {
    this.selectedCountry = country;
    this.isDropdownOpen = false;
    this.searchQuery = '';
    this.filteredCountries = [...this.countries];
    this.validateAndEmit();
  }

  onCountrySearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value.toLowerCase();

    this.filteredCountries = this.countries.filter(
      (country) =>
        country.name.toLowerCase().includes(this.searchQuery) ||
        country.dialCode.includes(this.searchQuery) ||
        country.code.toLowerCase().includes(this.searchQuery)
    );
  }

  // Phone number input methods
  onPhoneInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    // Allow only numbers, spaces, hyphens, and parentheses
    const cleaned = target.value.replace(/[^\d\s\-\(\)]/g, '');
    this.phoneNumber = cleaned;
    target.value = cleaned;

    this.validateAndEmit();
  }

  onPhoneBlur(): void {
    this.isTouched = true;
    this.onTouched();
  }

  // Validation methods
  private validatePhone(): void {
    const phonePattern = /^[\d\s\-\(\)]{7,15}$/;
    this.isValid =
      phonePattern.test(this.phoneNumber.trim()) &&
      this.phoneNumber.trim().length >= 7;

    if (this.showValidation) {
      this.validationChange.emit(this.isValid);
    }
  }

  private validateAndEmit(): void {
    this.validatePhone();

    const phoneValue: PhoneValue = {
      countryCode: this.selectedCountry.dialCode,
      phoneNumber: this.phoneNumber,
      fullNumber: `${this.selectedCountry.dialCode} ${this.phoneNumber}`.trim(),
      isValid: this.isValid,
    };

    this.onChange(phoneValue.fullNumber);
    this.phoneChange.emit(phoneValue);
  }

  // Utility methods
  getFormControlClasses(): string {
    const baseClasses = `form-control phone-input`;
    const sizeClasses = {
      sm: 'form-control-sm',
      md: '',
      lg: 'form-control-lg',
    };

    let classes = `${baseClasses} ${sizeClasses[this.size]}`;

    if (this.isValid && this.isTouched) {
      classes += ' is-valid';
    } else if (!this.isValid && this.isTouched && this.phoneNumber) {
      classes += ' is-invalid';
    }

    return classes;
  }

  // Click outside handler
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.phone-input-picker');

    if (dropdown && !dropdown.contains(target)) {
      this.isDropdownOpen = false;
      this.searchQuery = '';
      this.filteredCountries = [...this.countries];
    }
  }

  // TrackBy function for better performance
  trackByCountryCode(index: number, country: CountryCode): string {
    return country.code;
  }
}
