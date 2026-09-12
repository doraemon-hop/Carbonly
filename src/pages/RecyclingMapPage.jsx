import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { initialLocations } from '../data/mockData';
import { LeafletMap } from '../components/LeafletMap';
import { 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  Navigation, 
  Clock, 
  Phone, 
  CheckCircle2, 
  X, 
  ExternalLink,
  Wrench,
  Recycle,
  Sparkles
} from 'lucide-react';
import { VoiceSearchButton } from '../components/VoiceSearchButton';

export const RecyclingMapPage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [detailsModalLocation, setDetailsModalLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const data = await dataService.getLocations();
        const finalData = (data && data.length > 0) ? data : initialLocations;
        setLocations(finalData);
        if (finalData.length > 0) {
          setSelectedLocation(finalData[0]);
        }
      } catch {
        setLocations(initialLocations);
        setSelectedLocation(initialLocations[0]);
      }
      setIsLoading(false);
    };
    fetchLocations();
  }, []);

  const categories = [
    { id: 'all', label: 'All Drop-offs' },
    { id: 'ewaste', label: 'E-Waste' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'plastic', label: 'Plastic' },
    { id: 'repair', label: 'Repair Shops' },
  ];

  const filteredLocations = locations.filter((loc) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesCat = selectedCategory === 'all' || loc.categoryKey === selectedCategory;
    const matchesSearch = !q ||
      loc.name.toLowerCase().includes(q) ||
      (loc.address && loc.address.toLowerCase().includes(q)) ||
      (loc.category && loc.category.toLowerCase().includes(q)) ||
      (loc.categoryKey && loc.categoryKey.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const getCategoryBadgeClass = (categoryKey) => {
    switch (categoryKey) {
      case 'ewaste': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'repair': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'clothing': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'plastic': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Local Circular Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Recycling & Repair Locator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Find verified e-waste collection centers, plastic segregation hubs, fabric banks, and certified artisan repair shops near you in Ahmedabad.
          </p>
        </div>

        {/* Search Input with Voice Search 🎤 */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by center, area, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="w-full text-xs pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 shadow-sm"
          />
          {/* Voice Search Button – speaks into the search bar */}
          <VoiceSearchButton
            onResult={(text) => setSearchQuery(text)}
            className="absolute right-2 top-1.5"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-sm ${
              selectedCategory === c.id
                ? 'bg-slate-900 text-white shadow-slate-900/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Map & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List of Locations (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1">
          {filteredLocations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <p className="text-sm font-semibold">No centers found matching your filter.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-sm flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getCategoryBadgeClass(loc.categoryKey)}`}>
                        {loc.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                        {loc.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{loc.address}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 justify-end">
                        <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                        <span>{loc.rating}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {loc.distance}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailsModalLocation(loc);
                      }}
                      className="font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      View Details & Hours
                    </button>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(loc.name + ' ' + loc.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <span>Get Directions</span>
                      <Navigation className="w-3 h-3 text-emerald-600" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Interactive Leaflet Map (7 cols) */}
        <div className="lg:col-span-7 h-[640px] sticky top-20">
          <LeafletMap
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
          />
        </div>

      </div>

      {/* Location Details Modal */}
      {detailsModalLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="relative h-44">
              <img
                src={detailsModalLocation.image}
                alt={detailsModalLocation.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailsModalLocation(null)}
                className="absolute top-3 right-3 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-900 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${getCategoryBadgeClass(detailsModalLocation.categoryKey)}`}>
                  {detailsModalLocation.category}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{detailsModalLocation.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    ⭐ {detailsModalLocation.rating} ({detailsModalLocation.reviewsCount} reviews)
                  </span>
                  <span>•</span>
                  <span>{detailsModalLocation.distance} from your location</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detailsModalLocation.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{detailsModalLocation.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{detailsModalLocation.phone}</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Accepted Materials & Services:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {detailsModalLocation.acceptedItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setDetailsModalLocation(null)}
                  className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Close
                </button>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(detailsModalLocation.name + ' ' + detailsModalLocation.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-1/2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <span>Open Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
