import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { initialProducts } from '../data/mockData';
import { 
  ShoppingBag, 
  Store, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Star, 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  X
} from 'lucide-react';
import { VoiceSearchButton } from '../components/VoiceSearchButton';

export const MarketplacePage = () => {
  const { currentUser } = useAuth();
  const { userStats, addToast, triggerConfetti } = useApp();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'merchant'
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  // New product form state (for merchants)
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdPoints, setNewProdPoints] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Stationery');
  const [newProdSustain, setNewProdSustain] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [isSubmittingProd, setIsSubmittingProd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProds = async () => {
      setIsLoading(true);
      try {
        const data = await dataService.getProducts();
        setProducts(data && data.length > 0 ? data : initialProducts);
      } catch {
        setProducts(initialProducts);
      }
      setIsLoading(false);
    };
    fetchProds();
  }, []);

  const categories = ['all', 'Stationery', 'Bags & Storage', 'Drinkware', 'Clothing', 'Personal Care', 'Electronics'];

  const filteredProducts = products.filter((prod) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch = !q ||
      prod.name.toLowerCase().includes(q) ||
      (prod.merchantName && prod.merchantName.toLowerCase().includes(q)) ||
      (prod.sustainability && prod.sustainability.toLowerCase().includes(q)) ||
      (prod.category && prod.category.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleBuyProduct = (product) => {
    triggerConfetti();
    addToast({
      title: 'Order Placed! 🛍️',
      message: `Purchased "${product.name}" from ${product.merchantName}. +${product.ecoPoints} EcoPoints rewarded!`,
      type: 'points',
      points: product.ecoPoints,
    });
    setSelectedProductModal(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      addToast({ title: 'Validation Error', message: 'Name and price are required', type: 'error' });
      return;
    }

    try {
      setIsSubmittingProd(true);
      const added = await dataService.addProduct({
        name: newProdName,
        price: Number(newProdPrice),
        ecoPoints: Number(newProdPoints || Math.round(newProdPrice * 0.1)),
        category: newProdCategory,
        sustainability: newProdSustain || '100% circular, artisan-crafted sustainable materials.',
        image: newProdImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
        merchantName: currentUser?.businessName || currentUser?.name || 'Local Artisan Workshop',
        stock: 25,
      });

      setProducts([added, ...products]);
      triggerConfetti();
      addToast({
        title: 'Product Published! 🌱',
        message: `"${added.name}" is now live in the Green Marketplace.`,
        type: 'success',
      });

      // Reset form & view
      setNewProdName('');
      setNewProdPrice('');
      setNewProdPoints('');
      setNewProdSustain('');
      setNewProdImage('');
      setActiveTab('browse');
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'error' });
    } finally {
      setIsSubmittingProd(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sustainable Commerce</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Green Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Support local verified upcyclers and zero-waste craftsmen. Every purchase earns bonus EcoPoints.
          </p>
        </div>

        {/* Tab switch between Consumer and Merchant view */}
        <div className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs font-bold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'browse'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Products</span>
          </button>
          <button
            onClick={() => setActiveTab('merchant')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'merchant'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Merchant Portal</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: BROWSE MARKETPLACE */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          
          {/* Filter and Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-sm capitalize ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search with Voice Search 🎤 */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, merchants..."
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

          {/* Product Grid */}
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-xs">Loading products…</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              <p className="text-sm font-semibold">
                {searchQuery ? <>No products found for <strong>"{searchQuery}"</strong>.</> : 'No products available.'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-500/30">
                        +{prod.ecoPoints} EcoPoints
                      </span>
                    </div>
                    {prod.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-lg shadow-sm">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {prod.category}
                      </span>
                      <span className="text-emerald-700 font-bold text-[11px]">
                        {prod.carbonOffsetEquivalent}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {prod.sustainability}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="truncate">Seller: <strong className="text-slate-700">{prod.merchantName}</strong></span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-400" /> {prod.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900">₹{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-xs text-slate-400 line-through ml-1.5">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProductModal(prod)}
                      className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW 2: MERCHANT DASHBOARD */}
      {activeTab === 'merchant' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Merchant Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Listed Products</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{products.length} Items</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Active in Catalog</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Customer Purchases</div>
              <div className="text-2xl font-black text-slate-900 mt-1">142 Orders</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">+18% this month</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">EcoPoints Distributed</div>
              <div className="text-2xl font-black text-amber-600 mt-1">4,850 pts</div>
              <div className="text-[11px] text-slate-400 mt-1">Sponsored by Carbonly</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Merchant Status</div>
              <div className="text-lg font-black text-emerald-700 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5" />
                <span>Verified Partner</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Ahmedabad Green Circle</div>
            </div>
          </div>

          {/* Add New Product Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Sustainable Product</h3>
                <p className="text-xs text-slate-500">List an upcycled, zero-waste, or circular product in the marketplace.</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Instant Publish
              </span>
            </div>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Upcycled Denim Backpack"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Stationery">Stationery</option>
                  <option value="Bags & Storage">Bags & Storage</option>
                  <option value="Drinkware">Drinkware</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹ INR)</label>
                <input
                  type="number"
                  placeholder="299"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">EcoPoints Rewarded to Buyer</label>
                <input
                  type="number"
                  placeholder="30"
                  value={newProdPoints}
                  onChange={(e) => setNewProdPoints(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Sustainability & Material Details</label>
                <textarea
                  rows={3}
                  placeholder="Explain circular material sources, post-consumer content, or carbon savings..."
                  value={newProdSustain}
                  onChange={(e) => setNewProdSustain(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingProd}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmittingProd ? 'Publishing...' : 'Publish Product to Marketplace'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Merchant Perks Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">Partner Merchant Perks</h4>
              <p className="text-xs text-amber-800">
                Carbonly subsidizes customer EcoPoints discounts. Get zero platform commission on your first ₹50,000 in sales.
              </p>
            </div>
            <span className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shrink-0">
              0% Fee Activated
            </span>
          </div>

        </div>
      )}

      {/* Product Details Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="relative h-56">
              <img
                src={selectedProductModal.image}
                alt={selectedProductModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProductModal(null)}
                className="absolute top-3 right-3 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow">
                  +{selectedProductModal.ecoPoints} EcoPoints Reward
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {selectedProductModal.category}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedProductModal.name}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Sold by <strong className="text-slate-800">{selectedProductModal.merchantName}</strong> · ⭐ {selectedProductModal.rating}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sustainability Verification:</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {selectedProductModal.sustainability}
                </p>
                <div className="font-semibold text-emerald-800 pt-1">
                  Impact: {selectedProductModal.carbonOffsetEquivalent}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Total Price</div>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{selectedProductModal.price}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleBuyProduct(selectedProductModal)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <span>Confirm Order (+Points)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
