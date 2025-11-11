/**
 * Utility functions for encoding and decoding booking data for URL parameters
 */

export interface BookingData {
  transferType: string;
  transferTypeName: string;
  destinationId: number | null;
  destinationName: string;
  passengerCount: number;
  isRoundTrip: boolean;
  requiresWheelchairAccess: boolean;
  pickupType: string;
  pickupName?: string;
  pickupAddress?: string;
  airportId?: number | null;
  airportName?: string;
  terminalId?: number | null;
  terminalName?: string;
  flightNumber?: string;
  serviceDate: string;
  serviceTime: string;
  returnDate?: string;
  returnTime?: string;
  basePrice: number;
  emergencyFee: number;
  serviceFee: number;
  totalPrice: number;
  isEmergencyBooking: boolean;
}

/**
 * Safely encodes booking data into a URL-safe string
 * Uses Base64 encoding with URL-safe characters
 */
export function encodeBookingData(bookingData: BookingData): string {
  try {
    const jsonString = JSON.stringify(bookingData);
    // Use btoa for base64 encoding and make it URL-safe
    const base64 = btoa(jsonString);
    // Replace URL-unsafe characters
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Error encoding booking data:', error);
    throw new Error('Failed to encode booking data');
  }
}

/**
 * Safely decodes booking data from a URL parameter string
 * Returns null if decoding fails
 */
export function decodeBookingData(encodedData: string): BookingData | null {
  try {
    // Restore URL-unsafe characters
    let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonString = atob(base64);
    const bookingData = JSON.parse(jsonString);

    // Validate that the decoded data has the required structure
    if (isValidBookingData(bookingData)) {
      return bookingData;
    } else {
      console.warn('Invalid booking data structure:', bookingData);
      return null;
    }
  } catch (error) {
    console.error('Error decoding booking data:', error);
    return null;
  }
}

/**
 * Validates that the object has the required booking data structure
 */
function isValidBookingData(obj: any): obj is BookingData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.transferType === 'string' &&
    typeof obj.transferTypeName === 'string' &&
    (obj.destinationId === null || typeof obj.destinationId === 'number') &&
    typeof obj.destinationName === 'string' &&
    typeof obj.passengerCount === 'number' &&
    typeof obj.isRoundTrip === 'boolean' &&
    typeof obj.requiresWheelchairAccess === 'boolean' &&
    typeof obj.pickupType === 'string' &&
    typeof obj.serviceDate === 'string' &&
    typeof obj.serviceTime === 'string' &&
    typeof obj.basePrice === 'number' &&
    typeof obj.emergencyFee === 'number' &&
    typeof obj.serviceFee === 'number' &&
    typeof obj.totalPrice === 'number' &&
    typeof obj.isEmergencyBooking === 'boolean' &&
    // Optional properties validation
    (obj.airportId === undefined ||
      obj.airportId === null ||
      typeof obj.airportId === 'number') &&
    (obj.terminalId === undefined ||
      obj.terminalId === null ||
      typeof obj.terminalId === 'number') &&
    (obj.pickupName === undefined || typeof obj.pickupName === 'string') &&
    (obj.pickupAddress === undefined ||
      typeof obj.pickupAddress === 'string') &&
    (obj.airportName === undefined || typeof obj.airportName === 'string') &&
    (obj.terminalName === undefined || typeof obj.terminalName === 'string') &&
    (obj.flightNumber === undefined || typeof obj.flightNumber === 'string') &&
    (obj.returnDate === undefined || typeof obj.returnDate === 'string') &&
    (obj.returnTime === undefined || typeof obj.returnTime === 'string')
  );
}

/**
 * Generates a shareable checkout URL with encoded booking data
 */
export function generateShareableCheckoutUrl(
  bookingData: BookingData,
  baseUrl: string = window.location.origin
): string {
  const encodedData = encodeBookingData(bookingData);
  return `${baseUrl}/van-transfer-checkout/${encodedData}`;
}

/**
 * Creates a copy-to-clipboard friendly checkout URL
 */
export function copyCheckoutUrlToClipboard(
  bookingData: BookingData
): Promise<boolean> {
  try {
    const url = generateShareableCheckoutUrl(bookingData);

    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard
        .writeText(url)
        .then(() => true)
        .catch(() => false);
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve(success);
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return Promise.resolve(false);
  }
}
