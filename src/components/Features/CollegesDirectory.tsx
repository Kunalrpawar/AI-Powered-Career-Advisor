import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Navigation, Filter, Search, Star, DollarSign, Home, Bus, Wifi, Book, Users, Phone, Clock, Award } from 'lucide-react';

// Leaflet imports for map functionality
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const collegeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  degrees: string[];
  facilities: string[];
  hostel?: boolean;
  avgFeesPerYearINR?: number;
  safetyScore?: number;
  photos?: string[];
  phone?: string;
  email?: string;
  website?: string;
  established?: number;
  affiliation?: string;
  ranking?: number;
  description?: string;
};

const mockColleges: College[] = [
  {
    id: '1',
    name: 'Government Science College',
    city: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    degrees: ['B.Sc. Physics', 'B.Sc. Chemistry', 'B.Sc. Computer Science', 'M.Sc. Physics'],
    facilities: ['Hostel', 'Laboratory', 'Library', 'WiFi', 'Canteen', 'Sports Complex'],
    hostel: true,
    avgFeesPerYearINR: 12000,
    safetyScore: 4.4,
    phone: '+91-20-2567-8901',
    email: 'admissions@govtsciencepune.edu.in',
    website: 'www.govtsciencepune.edu.in',
    established: 1960,
    affiliation: 'University of Pune',
    ranking: 15,
    description: 'Premier government institution offering quality science education with excellent research facilities.',
    photos: []
  },
  {
    id: '2',
    name: 'Government Arts & Commerce College',
    city: 'Nashik',
    state: 'Maharashtra',
    lat: 19.9975,
    lng: 73.7898,
    degrees: ['B.A. English', 'B.A. History', 'B.Com. Accounting', 'M.A. Literature'],
    facilities: ['Library', 'Internet', 'Auditorium', 'Computer Lab', 'Career Counseling'],
    hostel: false,
    avgFeesPerYearINR: 9000,
    safetyScore: 4.1,
    phone: '+91-253-2234-567',
    email: 'info@govtartsnashik.edu.in',
    website: 'www.govtartsnashik.edu.in',
    established: 1945,
    affiliation: 'Savitribai Phule Pune University',
    ranking: 28,
    description: 'Historic institution providing comprehensive arts and commerce education.',
    photos: []
  },
  {
    id: '3',
    name: 'Government Engineering College',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    degrees: ['B.Tech Computer Science', 'B.Tech Mechanical', 'B.Tech Civil', 'M.Tech Software'],
    facilities: ['Hostel', 'Laboratory', 'Library', 'WiFi', 'Placement Cell', 'Innovation Hub'],
    hostel: true,
    avgFeesPerYearINR: 25000,
    safetyScore: 4.6,
    phone: '+91-22-2678-9012',
    email: 'admissions@govtengmumbai.edu.in',
    website: 'www.govtengmumbai.edu.in',
    established: 1958,
    affiliation: 'Mumbai University',
    ranking: 8,
    description: 'Leading engineering college with state-of-the-art facilities and excellent placement record.',
    photos: []
  },
  {
    id: '4',
    name: 'Government Medical College',
    city: 'Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    degrees: ['MBBS', 'MD', 'MS', 'DM', 'MCh'],
    facilities: ['Hostel', 'Hospital', 'Library', 'Research Labs', 'Simulation Center'],
    hostel: true,
    avgFeesPerYearINR: 15000,
    safetyScore: 4.8,
    phone: '+91-11-2389-4567',
    email: 'admissions@gmcdelhi.edu.in',
    website: 'www.gmcdelhi.edu.in',
    established: 1952,
    affiliation: 'Delhi University',
    ranking: 3,
    description: 'Premier medical institution with attached hospital and world-class medical education.',
    photos: []
  },
  {
    id: '5',
    name: 'Government Law College',
    city: 'Bangalore',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    degrees: ['LLB', 'LLM', 'BA LLB', 'BBA LLB'],
    facilities: ['Library', 'Moot Court', 'Computer Lab', 'Legal Aid Clinic'],
    hostel: false,
    avgFeesPerYearINR: 8000,
    safetyScore: 4.3,
    phone: '+91-80-2345-6789',
    email: 'info@glcbangalore.edu.in',
    website: 'www.glcbangalore.edu.in',
    established: 1949,
    affiliation: 'Karnataka State Law University',
    ranking: 12,
    description: 'Renowned law college providing excellent legal education and practical training.',
    photos: []
  },
  {
    id: '6',
    name: 'Government Polytechnic College',
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    degrees: ['Diploma in Mechanical', 'Diploma in Civil', 'Diploma in Electronics', 'Diploma in Computer'],
    facilities: ['Workshop', 'Laboratory', 'Library', 'Placement Cell', 'Industry Tie-ups'],
    hostel: true,
    avgFeesPerYearINR: 6000,
    safetyScore: 4.2,
    phone: '+91-44-2567-8901',
    email: 'admissions@gpcchennai.edu.in',
    website: 'www.gpcchennai.edu.in',
    established: 1963,
    affiliation: 'Anna University',
    ranking: 22,
    description: 'Leading polytechnic college offering industry-relevant diploma programs.',
    photos: []
  },
  {
    id: '7',
    name: 'Government Agriculture College',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    degrees: ['B.Sc Agriculture', 'M.Sc Agriculture', 'PhD Agriculture'],
    facilities: ['Farm', 'Laboratory', 'Library', 'Research Station', 'Greenhouse'],
    hostel: true,
    avgFeesPerYearINR: 10000,
    safetyScore: 4.5,
    phone: '+91-40-2456-7890',
    email: 'info@gachyderabad.edu.in',
    website: 'www.gachyderabad.edu.in',
    established: 1955,
    affiliation: 'Telangana State Agricultural University',
    ranking: 18,
    description: 'Premier agricultural college with extensive research facilities and practical training.',
    photos: []
  },
  {
    id: '8',
    name: 'Government Teacher Training College',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    degrees: ['B.Ed', 'M.Ed', 'D.El.Ed', 'Diploma in Education'],
    facilities: ['Practice School', 'Library', 'Psychology Lab', 'Computer Lab'],
    hostel: false,
    avgFeesPerYearINR: 5000,
    safetyScore: 4.0,
    phone: '+91-33-2345-6789',
    email: 'admissions@gttckolkata.edu.in',
    website: 'www.gttckolkata.edu.in',
    established: 1948,
    affiliation: 'West Bengal University of Teachers Training',
    ranking: 25,
    description: 'Dedicated to training quality teachers for primary and secondary education.',
    photos: []
  }
];

// Component to handle map centering
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// College Card Component
const CollegeCard: React.FC<{ 
  college: College & { distance?: number }; 
  distance?: number;
  onClick: () => void;
}> = ({ college, distance, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {college.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" />
            {college.city}, {college.state}
          </p>
          {college.established && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Established {college.established}
            </p>
          )}
        </div>
        {distance && (
          <div className="flex flex-col items-end">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">
              {distance.toFixed(1)} km
            </span>
            {college.ranking && (
              <div className="flex items-center gap-1 mt-2">
                <Award className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Rank #{college.ranking}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Annual Fees</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              ₹{college.avgFeesPerYearINR?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Safety Score</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {college.safetyScore ? `${college.safetyScore}/5` : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Hostel</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {college.hostel ? 'Available' : 'Not Available'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bus className="w-4 h-4 text-purple-600" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Transport</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bus/Local</p>
          </div>
        </div>
      </div>

      {/* Degrees */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Available Degrees</p>
        <div className="flex flex-wrap gap-1">
          {college.degrees.slice(0, 3).map((degree: string) => (
            <span 
              key={degree} 
              className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-md font-medium"
            >
              {degree}
            </span>
          ))}
          {college.degrees.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
              +{college.degrees.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Facilities */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Key Facilities</p>
        <div className="flex flex-wrap gap-1">
          {college.facilities.slice(0, 4).map((facility: string) => (
            <span 
              key={facility} 
              className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs px-2 py-1 rounded-md"
            >
              {facility}
            </span>
          ))}
          {college.facilities.length > 4 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
              +{college.facilities.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {college.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {college.description}
        </p>
      )}

      {/* Contact Info */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {college.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{college.phone}</span>
              </div>
            )}
            {college.affiliation && (
              <div className="flex items-center gap-1">
                <Book className="w-3 h-3" />
                <span className="truncate max-w-24">{college.affiliation}</span>
              </div>
            )}
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

const CollegesDirectory: React.FC = () => {
  const [query, setQuery] = useState('');
  const [colleges, setColleges] = useState<College[]>(mockColleges);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [radiusKm, setRadiusKm] = useState(25);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [filters, setFilters] = useState({
    hasHostel: false,
    maxFees: 50000,
    minSafety: 3.0
  });

  // Get user's current location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLoadingLocation(false);
        fetchNearbyColleges(latitude, longitude);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enable location services.');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Fetch nearby colleges from API
  const fetchNearbyColleges = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/colleges/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
      if (response.ok) {
        const data = await response.json();
        if (data.colleges && Array.isArray(data.colleges)) {
          setColleges(data.colleges);
        }
      }
    } catch (error) {
      console.log('Using mock data - API not available');
      // Continue with mock data if API fails
    }
  };

  // Refresh search with current location and filters
  const refreshSearch = () => {
    if (userLocation) {
      fetchNearbyColleges(userLocation.lat, userLocation.lng);
    }
  };

  // Auto-refresh when radius changes
  useEffect(() => {
    if (userLocation) {
      const timeoutId = setTimeout(() => {
        fetchNearbyColleges(userLocation.lat, userLocation.lng);
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [radiusKm, userLocation]);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and sort colleges
  const filteredColleges = useMemo(() => {
    let filtered = colleges.filter(college => {
      const matchesQuery = query === '' || 
        college.name.toLowerCase().includes(query.toLowerCase()) ||
        college.city.toLowerCase().includes(query.toLowerCase()) ||
        college.state.toLowerCase().includes(query.toLowerCase()) ||
        college.degrees.some(degree => degree.toLowerCase().includes(query.toLowerCase()));
      
      const matchesHostel = !filters.hasHostel || college.hostel;
      const matchesFees = !college.avgFeesPerYearINR || college.avgFeesPerYearINR <= filters.maxFees;
      const matchesSafety = !college.safetyScore || college.safetyScore >= filters.minSafety;
      
      return matchesQuery && matchesHostel && matchesFees && matchesSafety;
    });

    // Add distance and sort by distance if user location is available
    if (userLocation) {
      filtered = filtered
        .map(college => ({
          ...college,
          distance: college.lat && college.lng ? 
            calculateDistance(userLocation.lat, userLocation.lng, college.lat, college.lng) : null
        }))
        .filter(college => !college.distance || college.distance <= radiusKm)
        .sort((a, b) => {
          if (!a.distance) return 1;
          if (!b.distance) return -1;
          return a.distance - b.distance;
        });
    } else {
      // If no user location, show all colleges without distance filtering
      filtered = filtered.map(college => ({ ...college, distance: null }));
    }

    return filtered;
  }, [colleges, query, filters, userLocation, radiusKm]);

  useEffect(() => {
    // Auto-request location on component mount
    getCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                Government Colleges Directory
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover nearby government colleges with detailed information and interactive map
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showMap 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
              <button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
              >
                <Navigation className={`w-4 h-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
                {isLoadingLocation ? 'Locating...' : userLocation ? 'Update Location' : 'Enable Location'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Colleges</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, city, degree, or specialization..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Radius Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Radius</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>5 km</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{radiusKm} km</span>
                  <span>100 km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasHostel}
                  onChange={(e) => setFilters({...filters, hasHostel: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hostel Available</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Fees: ₹{filters.maxFees.toLocaleString()}/year
              </label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={filters.maxFees}
                onChange={(e) => setFilters({...filters, maxFees: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Safety Rating: {filters.minSafety}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={filters.minSafety}
                onChange={(e) => setFilters({...filters, minSafety: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Search Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshSearch}
                  disabled={!userLocation || isLoadingLocation}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search Colleges
                </button>
                
                <button
                  onClick={() => {
                    setQuery('');
                    setFilters({
                      hasHostel: false,
                      maxFees: 50000,
                      minSafety: 3.0
                    });
                    setRadiusKm(25);
                  }}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                >
                  <Navigation className={`w-4 h-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
                  {isLoadingLocation ? 'Updating...' : 'Update Location'}
                </button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  userLocation ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span>{userLocation ? 'Location enabled' : 'Location disabled'}</span>
              </span>
              <span>•</span>
              <span>{filteredColleges.length} colleges found</span>
            </div>
            {locationError && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {locationError}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map */}
        {showMap && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Interactive Map
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-auto">
                  {userLocation ? `${filteredColleges.length} colleges within ${radiusKm}km` : 'Enable location to see nearby colleges'}
                </span>
              </h3>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <MapContainer
                  center={userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629]} // Default to India center
                  zoom={userLocation ? 11 : 5}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Map controller for centering */}
                  {userLocation && (
                    <MapController 
                      center={[userLocation.lat, userLocation.lng]} 
                      zoom={11} 
                    />
                  )}
                  
                  {/* User location marker */}
                  {userLocation && (
                    <Marker 
                      position={[userLocation.lat, userLocation.lng]} 
                      icon={userIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <strong>Your Location</strong>
                          <br />
                          <span className="text-sm text-gray-600">
                            Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* College markers */}
                  {filteredColleges
                    .filter(college => college.lat && college.lng)
                    .map((college: any) => (
                    <Marker 
                      key={college.id}
                      position={[college.lat!, college.lng!]} 
                      icon={collegeIcon}
                      eventHandlers={{
                        click: () => setSelectedCollege(college)
                      }}
                    >
                      <Popup>
                        <div className="max-w-xs">
                          <h4 className="font-semibold text-gray-900 mb-2">{college.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {college.city}, {college.state}
                          </p>
                          {college.distance && (
                            <p className="text-xs text-green-600 font-medium mb-2">
                              📍 {college.distance.toFixed(1)} km away
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div>
                              <span className="text-gray-500">Fees:</span>
                              <br />
                              <strong>₹{college.avgFeesPerYearINR?.toLocaleString() || 'N/A'}</strong>
                            </div>
                            <div>
                              <span className="text-gray-500">Safety:</span>
                              <br />
                              <strong>{college.safetyScore ? `${college.safetyScore}/5` : 'N/A'}</strong>
                            </div>
                          </div>
                          <div className="text-xs mb-2">
                            <span className="text-gray-500">Degrees:</span>
                            <br />
                            {college.degrees.slice(0, 2).join(', ')}
                            {college.degrees.length > 2 && ` +${college.degrees.length - 2} more`}
                          </div>
                          <button 
                            onClick={() => setSelectedCollege(college)}
                            className="w-full bg-blue-600 text-white text-xs py-1.5 px-3 rounded hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              
              {/* Map Legend */}
              <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Government Colleges</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Click markers for details • Drag to explore
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Colleges Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredColleges.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No colleges found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {userLocation ? 
                  'Try adjusting your search criteria or increasing the search radius.' :
                  'Enable location access to find colleges near you.'
                }
              </p>
            </div>
          ) : (
            filteredColleges.map((college: any) => (
              <CollegeCard 
                key={college.id} 
                college={college} 
                distance={college.distance}
                onClick={() => setSelectedCollege(college)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegesDirectory;