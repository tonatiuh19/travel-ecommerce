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
  faGlobe,
  faChevronDown,
  faCheck,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

export interface Country {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-country-picker',
  templateUrl: './country-picker.component.html',
  styleUrls: ['./country-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountryPickerComponent),
      multi: true,
    },
  ],
})
export class CountryPickerComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() placeholder: string = 'Seleccione un país';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() label: string = '';
  @Input() errorMessage: string = '';

  @Output() countryChange = new EventEmitter<Country>();

  // FontAwesome Icons
  faGlobe = faGlobe;
  faChevronDown = faChevronDown;
  faCheck = faCheck;
  faSearch = faSearch;

  // Component state
  selectedCountry: Country | null = null;
  isDropdownOpen: boolean = false;
  filteredCountries: Country[] = [];
  searchQuery: string = '';
  isTouched: boolean = false;

  // Available countries
  countries: Country[] = [
    { name: 'España', code: 'ES', flag: '🇪🇸' },
    { name: 'Francia', code: 'FR', flag: '🇫🇷' },
    { name: 'Estados Unidos', code: 'US', flag: '🇺🇸' },
    { name: 'México', code: 'MX', flag: '🇲🇽' },
    { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
    { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
    { name: 'Chile', code: 'CL', flag: '🇨🇱' },
    { name: 'Perú', code: 'PE', flag: '🇵🇪' },
    { name: 'Brasil', code: 'BR', flag: '🇧🇷' },
    { name: 'Venezuela', code: 'VE', flag: '🇻🇪' },
    { name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
    { name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
    { name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
    { name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
    { name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
    { name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
    { name: 'Panamá', code: 'PA', flag: '🇵🇦' },
    { name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
    { name: 'Honduras', code: 'HN', flag: '🇭🇳' },
    { name: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
    { name: 'República Dominicana', code: 'DO', flag: '🇩🇴' },
    { name: 'Puerto Rico', code: 'PR', flag: '🇵🇷' },
    { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
    { name: 'Alemania', code: 'DE', flag: '🇩🇪' },
    { name: 'Reino Unido', code: 'GB', flag: '🇬🇧' },
    { name: 'Italia', code: 'IT', flag: '🇮🇹' },
    { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
    { name: 'Holanda', code: 'NL', flag: '🇳🇱' },
    { name: 'Bélgica', code: 'BE', flag: '🇧🇪' },
    { name: 'Suiza', code: 'CH', flag: '🇨🇭' },
    { name: 'Austria', code: 'AT', flag: '🇦🇹' },
    { name: 'Suecia', code: 'SE', flag: '🇸🇪' },
    { name: 'Noruega', code: 'NO', flag: '🇳🇴' },
    { name: 'Dinamarca', code: 'DK', flag: '🇩🇰' },
    { name: 'Finlandia', code: 'FI', flag: '🇫🇮' },
    { name: 'Polonia', code: 'PL', flag: '🇵🇱' },
    { name: 'Grecia', code: 'GR', flag: '🇬🇷' },
    { name: 'Irlanda', code: 'IE', flag: '🇮🇪' },
    { name: 'Canadá', code: 'CA', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { name: 'Nueva Zelanda', code: 'NZ', flag: '🇳🇿' },
    { name: 'Japón', code: 'JP', flag: '🇯🇵' },
    { name: 'China', code: 'CN', flag: '🇨🇳' },
    { name: 'Corea del Sur', code: 'KR', flag: '🇰🇷' },
    { name: 'India', code: 'IN', flag: '🇮🇳' },
    { name: 'Rusia', code: 'RU', flag: '🇷🇺' },
    { name: 'Sudáfrica', code: 'ZA', flag: '🇿🇦' },
    { name: 'Marruecos', code: 'MA', flag: '🇲🇦' },
    { name: 'Egipto', code: 'EG', flag: '🇪🇬' },
    { name: 'Turquía', code: 'TR', flag: '🇹🇷' },
    { name: 'Israel', code: 'IL', flag: '🇮🇱' },
    { name: 'Emiratos Árabes Unidos', code: 'AE', flag: '🇦🇪' },
    { name: 'Arabia Saudita', code: 'SA', flag: '🇸🇦' },
    { name: 'Singapur', code: 'SG', flag: '🇸🇬' },
    { name: 'Tailandia', code: 'TH', flag: '🇹🇭' },
    { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
    { name: 'Filipinas', code: 'PH', flag: '🇵🇭' },
    { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
    { name: 'Malasia', code: 'MY', flag: '🇲🇾' },
  ];

  // ControlValueAccessor implementation
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.filteredCountries = [...this.countries].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  ngOnDestroy(): void {
    this.isDropdownOpen = false;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value) {
      if (typeof value === 'string') {
        // Handle string value (country name or code)
        const country =
          this.countries.find((c) => c.name === value || c.code === value) ||
          null;
        this.selectedCountry = country;
      } else if (value.name && value.code) {
        // Handle object value
        this.selectedCountry = value;
      }
    } else {
      this.selectedCountry = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Component methods
  toggleDropdown(): void {
    if (!this.disabled) {
      this.isDropdownOpen = !this.isDropdownOpen;
      if (this.isDropdownOpen) {
        this.isTouched = true;
        this.onTouched();
        this.searchQuery = '';
        this.filteredCountries = [...this.countries].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }
    }
  }

  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.isDropdownOpen = false;
    this.isTouched = true;
    this.onTouched();
    this.onChange(country.name); // Return country name
    this.countryChange.emit(country);
  }

  filterCountries(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredCountries = [...this.countries].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else {
      this.filteredCountries = this.countries
        .filter(
          (country) =>
            country.name.toLowerCase().includes(query) ||
            country.code.toLowerCase().includes(query)
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  clearSelection(): void {
    this.selectedCountry = null;
    this.onChange(null);
    this.countryChange.emit(null as any);
  }

  // Click outside handler
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.country-picker-dropdown');
    const trigger = document.querySelector('.country-picker-trigger');

    if (
      this.isDropdownOpen &&
      dropdown &&
      trigger &&
      !dropdown.contains(target) &&
      !trigger.contains(target)
    ) {
      this.isDropdownOpen = false;
    }
  }
}
