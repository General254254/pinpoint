import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { MapPin, X, Navigation, Plus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { mapConfig, type MapPin as MapPinType } from '@/config';

// Fix for default marker icon in Leaflet with webpack/vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -40],
  shadowSize: [46, 46],
  className: 'hue-rotate-180',
});

// Map click handler component
interface MapClickHandlerProps {
  onMapClick: (latlng: LatLng) => void;
  isAddingPin: boolean;
}

function MapClickHandler({ onMapClick, isAddingPin }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      if (isAddingPin) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

// Location button component
function LocationButton({ onLocate }: { onLocate: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    locationfound: (e) => {
      onLocate([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return (
    <button
      onClick={() => map.locate()}
      className="absolute top-4 right-4 z-[1000] bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      title="Get my location"
    >
      <Navigation className="w-5 h-5" />
    </button>
  );
}

export function Map() {
  const [pins, setPins] = useState<MapPinType[]>(mapConfig.initialPins || []);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newPinPosition, setNewPinPosition] = useState<LatLng | null>(null);
  const [newPinLabel, setNewPinLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('map-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleMapClick = useCallback((latlng: LatLng) => {
    setNewPinPosition(latlng);
  }, []);

  const handleAddPin = useCallback(() => {
    if (newPinPosition && newPinLabel.trim()) {
      const newPin: MapPinType = {
        id: Date.now().toString(),
        lat: newPinPosition.lat,
        lng: newPinPosition.lng,
        label: newPinLabel.trim(),
      };
      setPins((prev) => [...prev, newPin]);
      setNewPinPosition(null);
      setNewPinLabel('');
      setIsAddingPin(false);
    }
  }, [newPinPosition, newPinLabel]);

  const handleRemovePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
    if (selectedPin === id) {
      setSelectedPin(null);
    }
  }, [selectedPin]);

  const handleLocate = useCallback((pos: [number, number]) => {
    // Optional: Add a pin at user's location
    console.log('User location:', pos);
  }, []);

  const cancelAddingPin = useCallback(() => {
    setIsAddingPin(false);
    setNewPinPosition(null);
    setNewPinLabel('');
  }, []);

  if (!mapConfig.label && !mapConfig.heading) {
    return null;
  }

  return (
    <section
      id="map-section"
      className="relative w-full py-20 lg:py-28 bg-white"
    >
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {mapConfig.label && (
            <span className="font-mono text-xs uppercase tracking-wider text-[#666] mb-4 block">
              {mapConfig.label}
            </span>
          )}
          {mapConfig.heading && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black tracking-tight">
              {mapConfig.heading}
            </h2>
          )}
          {mapConfig.description && (
            <p className="mt-4 text-lg text-[#666] max-w-2xl">
              {mapConfig.description}
            </p>
          )}
        </div>

        {/* Map Container */}
        <div
          className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ height: mapConfig.mapHeight || '500px' }}
        >
          {/* Controls */}
          <div className="absolute top-4 left-4 z-[1000] flex gap-2">
            <button
              onClick={() => setIsAddingPin(!isAddingPin)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${
                isAddingPin
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isAddingPin ? 'Click on map to pin' : 'Add Pin'}
              </span>
            </button>
            {isAddingPin && (
              <button
                onClick={cancelAddingPin}
                className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-white text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel</span>
              </button>
            )}
          </div>

          {/* Pin Count */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-medium text-black">
              {pins.length} {pins.length === 1 ? 'Location' : 'Locations'} Pinned
            </span>
          </div>

          {/* Leaflet Map */}
          <MapContainer
            center={mapConfig.defaultCenter || [51.505, -0.09]}
            zoom={mapConfig.defaultZoom || 13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} isAddingPin={isAddingPin} />
            <LocationButton onLocate={handleLocate} />

            {/* Render Pins */}
            {pins.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={selectedPin === pin.id ? selectedIcon : defaultIcon}
                eventHandlers={{
                  click: () => setSelectedPin(pin.id),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-black" />
                        <span className="font-medium text-sm">{pin.label}</span>
                      </div>
                      <button
                        onClick={() => handleRemovePin(pin.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove pin"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Lat: {pin.lat.toFixed(4)}, Lng: {pin.lng.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Temporary marker for new pin position */}
            {newPinPosition && (
              <Marker position={[newPinPosition.lat, newPinPosition.lng]} icon={selectedIcon}>
                <Popup closeButton={false}>
                  <div className="p-3 min-w-[200px]">
                    <p className="text-sm font-medium mb-2">Add New Location</p>
                    <input
                      type="text"
                      value={newPinLabel}
                      onChange={(e) => setNewPinLabel(e.target.value)}
                      placeholder="Enter location name..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-2"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddPin();
                        if (e.key === 'Escape') cancelAddingPin();
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddPin}
                        disabled={!newPinLabel.trim()}
                        className="flex-1 px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={cancelAddingPin}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Pinned Locations List */}
        {pins.length > 0 && (
          <div
            className={`mt-8 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-lg font-medium text-black mb-4">Pinned Locations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pins.map((pin, index) => (
                <div
                  key={pin.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-black">{pin.label}</p>
                      <p className="text-xs text-gray-500">
                        {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePin(pin.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                    title="Remove pin"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
