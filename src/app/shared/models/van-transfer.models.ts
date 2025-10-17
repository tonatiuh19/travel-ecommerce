export interface TransferType {
  id: number;
  typeKey: string;
  name: string;
  description: string;
  isRoundTripOption: boolean;
  maxPassengers: number;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  duration: string;
  distance: string;
  isRoundTrip: boolean;
  description: string;
}

export interface PricingTier {
  id: number;
  transferTypeId: number;
  destinationId: number | null;
  minPassengers: number;
  maxPassengers: number;
  priceEur: number;
  isSingleTrip: boolean;
}

export interface Airport {
  id: number;
  code: string;
  name: string;
  city: string;
}

export interface AirportTerminal {
  id: number;
  airportId: number;
  terminalCode: string;
  terminalName: string;
}

export interface PickupType {
  id: number;
  typeKey: string;
  name: string;
  description: string;
  requiresAddress: boolean;
  requiresAirport: boolean;
}

export interface PickupInfo {
  type: 'hotel' | 'airport' | 'airbnb' | '';
  name?: string;
  address?: string;
  airportId?: number;
  terminalId?: number;
  flightNumber?: string;
}

export interface BookingFormData {
  transferTypeKey: string;
  destinationId: number | null;
  passengerCount: number;
  isRoundTrip: boolean;
  requiresWheelchairAccess: boolean;
  pickupInfo: PickupInfo;
  serviceDate: string;
  serviceTime: string;
  returnDate: string | null;
  returnTime: string | null;
}

export interface PriceCalculation {
  basePrice: number;
  emergencyFee: number;
  serviceFee: number;
  totalPrice: number;
  pricingTier: PricingTier;
  isEmergencyBooking: boolean;
}

export interface Booking {
  id?: number;
  bookingReference: string;
  transferTypeId: number;
  destinationId: number | null;
  passengerCount: number;
  isRoundTrip: boolean;
  requiresWheelchairAccess: boolean;
  pickupType: 'hotel' | 'airport' | 'airbnb';
  pickupName: string | null;
  pickupAddress: string | null;
  pickupAirportId: number | null;
  pickupTerminalId: number | null;
  pickupFlightNumber: string | null;
  serviceDate: string;
  serviceTime: string;
  returnDate: string | null;
  returnTime: string | null;
  basePrice: number;
  emergencyFee: number;
  serviceFee: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface VanTransferState {
  transferTypes: TransferType[];
  destinations: Destination[];
  pricingTiers: PricingTier[];
  airports: Airport[];
  airportTerminals: AirportTerminal[];
  pickupTypes: PickupType[];
  loading: boolean;
  error: any | null;
  currentBooking: Booking | null;
  bookingResponse: any | null;
}
