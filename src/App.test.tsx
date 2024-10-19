import { getDistanceFromLatLonInKm } from './services/geolocation';

describe('Distance from lat lon in km', () => {
    it('should calculate the correct distance between two points with acceptable tolerance', () => {
      const loc1 = { lat: 40.7128, lng: -74.0060 }; // NYC
      const loc2 = { lat: 34.0522, lng: -118.2437 }; // LA
      
      const distance = getDistanceFromLatLonInKm([loc1.lat, loc1.lng], [loc2.lat, loc2.lng]);
      
      const expectedDistance = 3940; // Expected distance in kilometers
      const tolerance = 5; // Acceptable margin of error, since this is from ny to la we allow upto 5km precision. on smaller scales, this is around 99.9% accuracy.
      
      expect(distance).toBeGreaterThanOrEqual(expectedDistance - tolerance);
      expect(distance).toBeLessThanOrEqual(expectedDistance + tolerance);
    });
  });
