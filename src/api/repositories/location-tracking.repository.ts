
import { apiClient } from '../apiClient';
import { apiUrl } from '../apiUrl';

export interface TrackingPoint {
  id: string;
  employeeId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  locationName?: string;
  activity?: string;
}

// Enhanced mock data for location tracking with more variation
const generateMockTrackingData = (employeeId: string, date: string): TrackingPoint[] => {
  const baseDate = new Date(date);
  
  // Define base coordinates near a city center and create variations
  // Each employee will have a different starting location
  const employeeLocations = [
    { lat: 40.7128, lng: -74.0060 }, // NYC
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 41.8781, lng: -87.6298 }, // Chicago
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: 42.3601, lng: -71.0589 }, // Boston
  ];
  
  // Get base location for this employee
  const employeeIndex = parseInt(employeeId) % employeeLocations.length;
  let baseLat = employeeLocations[employeeIndex].lat;
  let baseLng = employeeLocations[employeeIndex].lng;
  
  // Generate tracking points for a typical day (9AM - 5PM)
  const points: TrackingPoint[] = [];
  
  // Morning commute to work (9:00 - 9:30 AM)
  for (let i = 0; i < 6; i++) {
    const time = new Date(baseDate);
    time.setHours(9, i * 5, 0);
    
    points.push({
      id: `${employeeId}-${date}-${i}`,
      employeeId,
      latitude: baseLat + (i * 0.002),
      longitude: baseLng - (i * 0.002),
      timestamp: time.toISOString(),
      locationName: i === 0 ? 'Home' : i === 5 ? 'Office Building' : 'Commuting'
    });
  }
  
  // At work (9:30 AM - 12:00 PM)
  for (let i = 0; i < 5; i++) {
    const time = new Date(baseDate);
    time.setHours(10 + Math.floor(i/2), (i % 2) * 30, 0);
    
    points.push({
      id: `${employeeId}-${date}-${i+6}`,
      employeeId,
      latitude: baseLat + 0.012 + (Math.random() * 0.001 - 0.0005),
      longitude: baseLng - 0.012 + (Math.random() * 0.001 - 0.0005),
      timestamp: time.toISOString(),
      locationName: 'Office Building',
      activity: ['Meeting', 'Desk Work', 'Conference Room'][Math.floor(Math.random() * 3)]
    });
  }
  
  // Lunch break (12:00 PM - 1:00 PM)
  for (let i = 0; i < 3; i++) {
    const time = new Date(baseDate);
    time.setHours(12, i * 20, 0);
    
    points.push({
      id: `${employeeId}-${date}-${i+11}`,
      employeeId,
      latitude: baseLat + 0.015 + (i * 0.001),
      longitude: baseLng - 0.010 - (i * 0.001),
      timestamp: time.toISOString(),
      locationName: i === 1 ? 'Restaurant' : 'Walking',
      activity: 'Lunch Break'
    });
  }
  
  // Back at work (1:00 PM - 5:00 PM)
  for (let i = 0; i < 8; i++) {
    const time = new Date(baseDate);
    time.setHours(13 + Math.floor(i/2), (i % 2) * 30, 0);
    
    points.push({
      id: `${employeeId}-${date}-${i+14}`,
      employeeId,
      latitude: baseLat + 0.012 + (Math.random() * 0.001 - 0.0005),
      longitude: baseLng - 0.012 + (Math.random() * 0.001 - 0.0005),
      timestamp: time.toISOString(),
      locationName: 'Office Building',
      activity: ['Meeting', 'Desk Work', 'Conference Room', 'Client Call'][Math.floor(Math.random() * 4)]
    });
  }
  
  // Evening commute (5:00 - 5:30 PM)
  for (let i = 0; i < 6; i++) {
    const time = new Date(baseDate);
    time.setHours(17, i * 5, 0);
    
    points.push({
      id: `${employeeId}-${date}-${i+22}`,
      employeeId,
      latitude: baseLat + 0.012 - (i * 0.002),
      longitude: baseLng - 0.012 + (i * 0.002),
      timestamp: time.toISOString(),
      locationName: i === 0 ? 'Office Building' : i === 5 ? 'Home' : 'Commuting'
    });
  }
  
  return points;
};

export const locationTrackingRepository = {
  getTrackingData: (employeeId: string, startDate: string, endDate: string) => {
    // Create a range of dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    
    // Generate array of dates in range
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dates.push(new Date(dt).toISOString().split('T')[0]);
    }
    
    // Generate mock data for each date
    const allData = dates.flatMap(date => generateMockTrackingData(employeeId, date));
    
    // Return as mock API response
    return Promise.resolve({ data: allData });
  },
  
  // Other repository methods would go here
};
