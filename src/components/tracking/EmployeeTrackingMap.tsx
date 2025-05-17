
import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { TrackingPoint } from '@/api/repositories/location-tracking.repository';

interface EmployeeTrackingMapProps {
  trackingData: TrackingPoint[];
  isLoading: boolean;
}

const EmployeeTrackingMap = ({ trackingData, isLoading }: EmployeeTrackingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const pathRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  // Use the provided API key directly
  const [apiKey] = useState<string>("AIzaSyDNeLypEkx-T6ScCk925xwUQ7nQ4w1BuOs");
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey) return;
    
    const googleMapsScript = document.getElementById('google-maps-script');
    
    if (!googleMapsScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => setError("Failed to load Google Maps. Please check your API key.");
      document.head.appendChild(script);
      
      return () => {
        const scriptToRemove = document.getElementById('google-maps-script');
        if (scriptToRemove) {
          document.head.removeChild(scriptToRemove);
        }
      };
    } else {
      setMapLoaded(true);
    }
  }, [apiKey]);

  // Initialize map when DOM is ready and script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;
    
    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        mapTypeId: 'roadmap',
        fullscreenControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        zoomControl: true
      });
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize map. Please check console for details.");
    }

    return () => {
      // Clean up markers and path on unmount
      if (pathRef.current) {
        pathRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [mapLoaded]);

  // Update map with tracking data
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !trackingData.length || !window.google) return;

    const map = mapInstanceRef.current;
    
    // Clear previous markers and path
    if (pathRef.current) {
      pathRef.current.setMap(null);
    }
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Create path coordinates
    const sortedData = [...trackingData].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const path = sortedData.map(point => ({
      lat: point.latitude,
      lng: point.longitude
    }));
    
    if (path.length > 0) {
      // Create path
      pathRef.current = new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      
      pathRef.current.setMap(map);
      
      // Add markers for start and end points
      const startMarker = new window.google.maps.Marker({
        position: path[0],
        map,
        title: `Start: ${new Date(sortedData[0].timestamp).toLocaleTimeString()}`,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
      });
      
      const endMarker = new window.google.maps.Marker({
        position: path[path.length - 1],
        map,
        title: `End: ${new Date(sortedData[sortedData.length - 1].timestamp).toLocaleTimeString()}`,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        }
      });
      
      markersRef.current = [startMarker, endMarker];
      
      // Add tracking points as small markers
      sortedData.forEach((point, index) => {
        if (index !== 0 && index !== sortedData.length - 1) {
          const marker = new window.google.maps.Marker({
            position: { lat: point.latitude, lng: point.longitude },
            map,
            title: `${new Date(point.timestamp).toLocaleTimeString()} - ${point.locationName || 'Unknown'}`,
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              // Fix the Size type error by using a simple object instead of constructor
              scaledSize: new google.maps.Size(15, 15)
            }
          });
          markersRef.current.push(marker);
        }
      });
      
      // Fit bounds to include all points
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
    }
  }, [trackingData, mapLoaded]);

  if (error) {
    return (
      <Card className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading tracking data...</p>
      </Card>
    );
  }

  if (trackingData.length === 0) {
    return (
      <Card className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No tracking data available for the selected employee and date range.</p>
      </Card>
    );
  }

  return <div ref={mapRef} className="h-full w-full rounded-md" />;
};

export default EmployeeTrackingMap;
