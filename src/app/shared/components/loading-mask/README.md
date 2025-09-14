# Loading Mask Component

A reusable loading mask component with an animated Font Awesome truck icon that respects your application's color palette.

## Features

- ✨ Beautiful Font Awesome truck icon with bouncing animation
- 🎨 Uses your app's color palette (`--color-soft-blue`, `--color-dark-slate`, `--color-warm-terracotta`, `--color-blue-gray`)
- 📱 Responsive design for mobile and desktop
- 🔧 Configurable size, message, and overlay behavior
- 🚀 Smooth CSS animations with optimal performance
- ⚙️ Includes spinning wheel effect and moving road animation

## Usage

### Basic Usage

```html
<app-loading-mask [isVisible]="isLoading"></app-loading-mask>
```

### Full Screen Loading Overlay

```html
<app-loading-mask [isVisible]="isProcessingPayment" [fullScreen]="true" message="Procesando pago..." size="large"> </app-loading-mask>
```

### Inline Loading (Non-fullscreen)

```html
<app-loading-mask [isVisible]="isLoadingData" [fullScreen]="false" message="Cargando información..." size="medium"> </app-loading-mask>
```

## Input Properties

| Property     | Type                             | Default         | Description                                     |
| ------------ | -------------------------------- | --------------- | ----------------------------------------------- |
| `isVisible`  | `boolean`                        | `false`         | Controls the visibility of the loading mask     |
| `message`    | `string`                         | `'Cargando...'` | The loading message displayed below the truck   |
| `fullScreen` | `boolean`                        | `true`          | Whether to show as fullscreen overlay or inline |
| `size`       | `'small' \| 'medium' \| 'large'` | `'medium'`      | Size of the loading animation                   |

## Examples

### Checkout Payment Processing

```typescript
// In your component
export class CheckoutModalComponent {
  isProcessingPayment: boolean = false;

  async handlePayment() {
    this.isProcessingPayment = true;
    try {
      // Process payment logic
      await this.processPayment();
    } finally {
      this.isProcessingPayment = false;
    }
  }
}
```

```html
<!-- In your template -->
<app-loading-mask [isVisible]="isProcessingPayment" message="Procesando tu pago..." size="large"> </app-loading-mask>
```

### Data Loading

```typescript
export class DataComponent {
  isLoadingData: boolean = false;

  async loadData() {
    this.isLoadingData = true;
    try {
      this.data = await this.dataService.getData();
    } finally {
      this.isLoadingData = false;
    }
  }
}
```

```html
<div class="data-container">
  <app-loading-mask [isVisible]="isLoadingData" [fullScreen]="false" message="Cargando destinos..." size="small"> </app-loading-mask>

  <div *ngIf="!isLoadingData" class="data-content">
    <!-- Your data content here -->
  </div>
</div>
```

## Animation Details

The loading mask includes several animated elements:

- **🚛 Font Awesome Truck Icon**: Gentle bouncing animation with shadow effects
- **⚙️ Spinner Icon**: Continuous spinning wheel overlay to simulate movement
- **🛣️ Road**: Moving dashed line effect beneath the truck
- **⚪ Dots**: Pulsing loading dots below the message

## Font Awesome Icons Used

- `faTruckMoving` - Main truck icon with bouncing animation
- `faSpinner` - Rotating wheel effect for motion simulation
- Icons automatically scale with the size property

## Color Palette

The component uses your application's CSS custom properties:

- `--color-soft-blue` (#9db4c2) - For wheels, text, and accents
- `--color-dark-slate` (#112d35) - For truck outline and road
- `--color-warm-terracotta` (#bb6557) - For truck cargo area
- `--color-blue-gray` (#6a8fa7) - For truck cabin and loading dots

## Mobile Responsiveness

The component automatically adjusts for different screen sizes:

- **Desktop**: Full-size animation
- **Tablet** (≤768px): Scaled down truck elements
- **Mobile** (≤480px): Further size reduction and optimized spacing

## Performance Notes

- Uses CSS transforms and animations for optimal performance
- Hardware acceleration enabled for smooth animations
- Minimal DOM manipulation
- Respects `prefers-reduced-motion` accessibility setting

## Integration with Existing Code

The component is already integrated into your `SharedModule`, so you can use it anywhere in your application by importing the `SharedModule`.

Make sure your component template includes the loading mask where needed, and control its visibility with a boolean property in your component class.
