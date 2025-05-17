
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
  const apiKey = "AIzaSyDNeLypEkx-T6ScCk925xwUQ7nQ4w1BuOs";
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const googleMapsScript = document.getElementById('google-maps-script');
    
    if (!googleMapsScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        setMapLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setError("Failed to load Google Maps. Please check your API key.");
      };
      
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
    if (!mapLoaded || !mapRef.current) {
      console.log('Map not ready yet:', { mapLoaded, mapRefCurrent: !!mapRef.current });
      return;
    }
    
    // Check if Google Maps is available
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      console.error('Google Maps API not available');
      setError('Google Maps API not available');
      return;
    }
    
    try {
      console.log('Initializing map...');
      const mapOptions = {
        zoom: 14,
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        mapTypeId: 'roadmap',
        fullscreenControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        zoomControl: true
      };
      
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
      console.log('Map initialized successfully');
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
    if (!mapLoaded || !mapInstanceRef.current || !trackingData.length) {
      console.log('Not ready to draw path:', { 
        mapLoaded, 
        mapInstance: !!mapInstanceRef.current, 
        trackingDataLength: trackingData.length 
      });
      return;
    }

    console.log('Drawing path with tracking data:', trackingData.length, 'points');
    
    const map = mapInstanceRef.current;
    
    // Clear previous markers and path
    if (pathRef.current) {
      pathRef.current.setMap(null);
    }
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    try {
      // Create path coordinates
      const sortedData = [...trackingData].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      const path = sortedData.map(point => ({
        lat: point.latitude,
        lng: point.longitude
      }));
      
      if (path.length > 0) {
        console.log('Creating path with points:', path);
        
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
        
        // Create a bounds object
        const bounds = new window.google.maps.LatLngBounds();
        
        // Add tracking points as small markers and extend bounds
        path.forEach((point, index) => {
          // Add point to bounds
          bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
          
          // Add markers for intermediate points
          if (index !== 0 && index !== path.length - 1) {
            const marker = new window.google.maps.Marker({
              position: point,
              map,
              title: `${new Date(sortedData[index].timestamp).toLocaleTimeString()} - ${sortedData[index].locationName || 'Unknown'}`,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(15, 15)
              }
            });
            markersRef.current.push(marker);
          }
        });
        
        // Fit map to bounds
        console.log('Fitting map to bounds');
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error updating map with tracking data:', error);
      setError('Error displaying tracking data on map');
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
