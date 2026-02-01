"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  Search, Calendar, CheckCircle, ArrowRight, Download, 
  Activity, ShieldCheck, User, Filter, LayoutDashboard, 
  Package, Truck, PieChart, Settings, Percent, Info,
  Heart, ShoppingCart, FileText, LogOut  // Added icons for wishlist, cart, terms, logout
} from 'lucide-react';

export default function RentalHackathonPortal() {
  const { data: session } = useSession();
  // Removed view state and role switcher logic
  const [dates, setDates] = useState({ start: '', end: '' });
  const [activeCategory, setActiveCategory] = useState('All');
  const [isProfileOpen, setIsProfileOpen] = useState(false);  // Added for account dropdown
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const categories = ['All', 'Electronics', 'Furniture', 'Tools', 'Outdoor', 'Party Supplies'];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeCategory !== 'All') {
          params.append('category', activeCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery]);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!session) return;
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const cart = await response.json();
          setCartCount(cart.items?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };
    fetchCartCount();
  }, [session]);

  // Helper function to format category name
  const formatCategory = (category) => {
    if (!category) return '';
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen font-sans bg-[#eff1f1]" style={{ color: '#25343F' }}>
      
      {/* 1. WINNING NAV: ROLE SWITCHER & COMPLIANCE */}
      <nav className="sticky top-0 z-50 p-4 bg-[#25343F] text-white shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="text-[#FF9B51]" />
            <h1 className="font-black tracking-tighter text-xl italic">PRO<span className="text-[#FF9B51]">RENT</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-[#FF9B51] transition text-sm font-medium">
              <FileText size={18} className="inline mr-1" /> Terms & Conditions
            </button>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
              <Heart size={18} />
            </button>
            <Link href="/cart" className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF9B51] text-white text-[8px] px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition flex items-center justify-center"
              >
                <User size={18} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-[#25343F] rounded-lg shadow-lg border border-[#BFC9D1] z-50">
                  <div className="p-3 border-b border-[#EAEFEF]">
                    <p className="text-xs opacity-60 mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-[#FF9B51]">
                      {session?.user?.name || 'Guest'} {session?.user?.role && `(${session.user.role})`}
                    </p>
                  </div>
                  <Link href="/cart" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#EAEFEF]">
                    <ShoppingCart size={16} /> My Cart
                  </Link>
                  <a href="/user/order" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#EAEFEF]">
                    <Package size={16} /> My Orders
                  </a>
                  <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#EAEFEF]">
                    <Settings size={16} /> Settings
                  </a>
                  {session ? (
                    <button 
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left block px-4 py-2 text-sm hover:bg-red-50 text-red-500 flex items-center gap-2 border-t border-[#EAEFEF]"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  ) : (
                    <Link href="/login" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#EAEFEF] border-t border-[#EAEFEF]">
                      <User size={16} /> Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. CUSTOMER VIEW ONLY */}
      <main className="animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Search & Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
          <h2 className="text-6xl font-black mb-6 leading-tight">
            Enterprise Logistics. <br/>
            <span className="text-[#FF9B51]">Simplified.</span>
          </h2>
          
          <div className="w-full max-w-4xl bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 border border-[#BFC9D1]">
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
              <Search size={20} className="text-[#BFC9D1]" />
              <input 
                type="text" 
                placeholder="What equipment do you need?" 
                className="w-full outline-none font-medium text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 bg-[#EAEFEF] rounded-xl px-4 py-3">
              <Calendar size={18} className="text-[#25343F]" />
              <input type="date" className="bg-transparent text-xs font-bold outline-none" onChange={(e) => setDates({...dates, start: e.target.value})} />
              <span className="opacity-30">→</span>
              <input type="date" className="bg-transparent text-xs font-bold outline-none" onChange={(e) => setDates({...dates, end: e.target.value})} />
            </div>
            <button className="bg-[#25343F] text-white px-8 py-4 rounded-xl font-black text-xs uppercase hover:bg-[#FF9B51] transition-all">
              Find Available Stock
            </button>
          </div>
        </section>

        {/* FILTER BAR SECTION */}
        <section className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#BFC9D1] text-[10px] font-black uppercase tracking-widest">
              <Filter size={14} /> Filter By:
            </div>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-[#25343F] text-white border-[#25343F]' : 'bg-white border-[#BFC9D1] hover:border-[#FF9B51]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCT LISTING: Reservation Logic Implementation */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <Package size={48} className="mx-auto mb-4 opacity-30 animate-pulse" />
              <p className="text-sm font-bold opacity-50">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm font-bold opacity-50">No products found</p>
            </div>
          ) : (
            products.map(product => {
              const isAvailable = product.totalStock > 0 && product.isRentable;
              return (
                <Link 
                  key={product.id} 
                  href={`/product?id=${product.id}`}
                  className={`bg-white rounded-[2.5rem] p-8 border-b-8 shadow-sm transition-all ${!isAvailable ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:shadow-2xl hover:border-[#FF9B51] cursor-pointer'}`} 
                  style={{ borderBottomColor: !isAvailable ? '#BFC9D1' : '#25343F' }}
                >
                  <div className="h-52 bg-[#EAEFEF] rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={48} className="opacity-10 text-[#25343F]" />
                    )}
                    {!isAvailable ? (
                      <span className="absolute top-4 right-4 bg-[#25343F] text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">Out of Stock</span>
                    ) : (
                      <span className="absolute top-4 right-4 bg-green-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">In Stock</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#BFC9D1]">{formatCategory(product.category)}</span>
                    {isAvailable && <div className="w-1 h-1 rounded-full bg-[#FF9B51]"></div>}
                  </div>
                  <h3 className="text-2xl font-black mb-6">{product.name}</h3>
                  <div className="flex justify-between items-center pt-6 border-t border-[#EAEFEF]">
                    <div>
                        <span className="text-3xl font-black">Rs{product.dailyRate || 0}</span>
                        <span className="text-[10px] font-bold opacity-40 ml-1">/DAY</span>
                    </div>
                    <button 
                      disabled={!isAvailable} 
                      className="bg-[#25343F] p-4 rounded-2xl text-white transition hover:bg-[#FF9B51] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        if (!isAvailable) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </Link>
              );
            })
          )}
        </section>
      </main>

      {/* 3. ERP COMPLIANCE FOOTER */}
      <footer className="bg-white border-t border-[#BFC9D1] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
           <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#FF9B51]" size={24} />
              <p className="text-xs font-black uppercase tracking-widest opacity-60 italic">Compliance Grade: GST Ready Enterprise System</p>
           </div>
           <div className="flex gap-10 mt-6 md:mt-0">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-50"><CheckCircle size={14}/> Auto-Invoicing</div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-50"><CheckCircle size={14}/> Damage Protection</div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-50"><CheckCircle size={14}/> Security Deposits</div>
           </div>
        </div>
      </footer>
    </div>
  );
}

