"use client";
import React, { useState } from 'react';
import { 
  Calendar, ShieldCheck, Info, ArrowLeft, Star, 
  Plus, Minus, ShoppingCart, Heart, Share2, 
  CheckCircle, Clock, Wallet, AlertCircle,
  Activity, FileText, User, Package, Settings, LogOut  // Added missing icons
} from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [rentalDates, setRentalDates] = useState({ start: '', end: '' });
  const [isProfileOpen, setIsProfileOpen] = useState(false);  // Added missing state

  // Mock Product Data 
  const product = {
    name: "Canon E0S",
    brand: "build.ltd",
    rating: 4.8,
    reviews: 124,
    dailyRate: 120,
    securityDeposit: 500, //
    gstRate: "18%",
    status: "Available",
    description: "Heavy-duty industrial generator suitable for large scale construction sites and event backup. Features Odoo-integrated IoT monitoring for fuel levels and maintenance alerts.",
    specs: [
      { label: "Fuel Type", value: "Diesel" },
      { label: "Power Output", value: "500 kVA" },
      { label: "Weight", value: "1200 kg" },
      { label: "Compliance", value: "Stage V Emissions" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#EAEFEF] font-sans pb-20" style={{ color: '#25343F' }}>
         <nav className="p-6 sticky top-0 z-50 bg-white border-b border-[#BFC9D1] shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Activity size={28} style={{ color: '#FF9B51' }} /> PRO<span className="opacity-60">RENT</span>
            </h1>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[#FF9B51] transition">
          <Link href="/" className="flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </button>
            <div className="hidden lg:flex space-x-6 text-[10px] font-black uppercase tracking-widest opacity-70">
              <a href="#" className="hover:text-[#FF9B51] flex items-center gap-1"><FileText size={14}/>Terms & Conditions</a>
              <a href="#" className="hover:text-[#FF9B51] transition">Product</a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-[#BFC9D1] pr-6">
              <button className="relative hover:text-[#FF9B51] transition">
                <Heart size={20} />
                <span className="absolute -top-2 -right-2 bg-[#FF9B51] text-white text-[8px] px-1.5 rounded-full">0</span>
              </button>
              <button className="relative hover:text-[#FF9B51] transition">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-[#25343F] text-white text-[8px] px-1.5 rounded-full">0</span>
              </button>
            </div>

            {/* Oval Account Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full border-2 border-[#25343F] hover:bg-[#25343F] hover:text-white transition-all group"
              >
                <User size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Account</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-[#BFC9D1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-[#EAEFEF] bg-[#EAEFEF]/50">
                    <p className="text-[10px] font-black opacity-40 uppercase">Signed in as</p>
                    <p className="text-xs font-bold truncate text-[#FF9B51]">John Doe (Vendor)</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#EAEFEF] transition-colors"><Package size={14}/> My Orders</button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#EAEFEF] transition-colors"><Settings size={14}/> Settings</button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-red-50 text-red-500 transition-colors border-t border-[#EAEFEF]"><LogOut size={14}/> Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-15 grid lg:grid-cols-12 gap-12">
        
        {/* 2. LEFT COLUMN: IMAGE GALLERY */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[4/3] bg-white rounded-[3rem] border-2 border-[#BFC9D1] flex items-center justify-center relative overflow-hidden group shadow-xl">
            <div className="absolute top-8 left-8 bg-[#25343F] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Vendor: BuildCorp Ltd
            </div>
            <div className=" font-black text-8xl italic"><img src="https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Product Image" className="w-full h-full object-cover" /></div>
            {/* Tag for In-Stock status */}
            <div className="absolute bottom-8 right-8 bg-green-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
              <CheckCircle size={14} /> Ready for Pickup
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <img 
                key={i} 
                src={`https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} 
                alt={`Thumbnail ${i}`} 
                className="w-full h-full object-cover rounded-2xl border border-[#BFC9D1] hover:border-[#FF9B51] transition-all cursor-pointer" 
              />
            ))}
          </div>

          {/* Added buttons below images */}
          <div className="flex gap-4">
            <button className="p-3 bg-white rounded-full shadow-sm border border-[#BFC9D1] hover:text-[#FF9B51] transition"><Heart size={18} /></button>
            <button className="p-3 bg-white rounded-full shadow-sm border border-[#BFC9D1] hover:text-[#FF9B51] transition"><Share2 size={18} /></button>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: RENTAL CONFIGURATOR */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-[#FF9B51] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">{product.brand} Industrial</span>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tighter mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[#FF9B51]">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />)}
              </div>
              <span className="text-[10px] font-black uppercase opacity-40">{product.reviews} Verified Reviews</span>
            </div>
          </div>

          {/* PRICING CARD */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#BFC9D1] shadow-2xl space-y-6">
            <div className="flex justify-between items-end pb-6 border-b border-[#EAEFEF]">
              <div>
                <p className="text-[10px] font-black uppercase opacity-40 mb-1">Rental Rate</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">Rs{product.dailyRate}</span>
                  <span className="text-xs font-bold opacity-40">/ per day</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase opacity-40 mb-1">Security Deposit</p>
                <span className="text-xl font-black text-[#25343F]">Rs{product.securityDeposit}</span>
              </div>
            </div>

            {/* RENTAL PERIOD PICKER */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-[#FF9B51]" /> Select Rental Period
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#EAEFEF] p-4 rounded-2xl border border-transparent focus-within:border-[#FF9B51] transition">
                  <p className="text-[8px] font-black uppercase opacity-40 mb-1">Start Date</p>
                  <input 
                    type="date" 
                    className="bg-transparent outline-none w-full text-xs font-bold" 
                    onChange={(e) => setRentalDates({...rentalDates, start: e.target.value})}
                  />
                </div>
                <div className="bg-[#EAEFEF] p-4 rounded-2xl border border-transparent focus-within:border-[#FF9B51] transition">
                  <p className="text-[8px] font-black uppercase opacity-40 mb-1">End Date</p>
                  <input 
                    type="date" 
                    className="bg-transparent outline-none w-full text-xs font-bold"
                    onChange={(e) => setRentalDates({...rentalDates, end: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* QUANTITY & ADD TO CART */}
            <div className="flex gap-4">
              <div className="flex items-center bg-[#EAEFEF] rounded-2xl p-2">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center hover:text-[#FF9B51] transition"><Minus size={16} /></button>
                <span className="w-8 text-center font-black text-sm">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="w-10 h-10 flex items-center justify-center hover:text-[#FF9B51] transition"><Plus size={16} /></button>
              </div>
              <button className="flex-1 bg-[#FF9B51] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-lg hover:brightness-110 transition active:scale-95">
                <ShoppingCart size={18} /> Add to Rental Cart
              </button>
            </div>

            {/* ERP COMPLIANCE INFO */}
            <div className="p-4 bg-[#25343F] rounded-2xl flex items-center gap-4 text-white">
              <ShieldCheck size={24} className="text-[#FF9B51]" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest">GST & Insurance Included</p>
                <p className="text-[8px] opacity-60">Automatic Quotation generation .</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. DETAILS TABS SECTION (Medium Highlighted Style) */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="bg-white rounded-[3rem] border-2 border-[#BFC9D1] overflow-hidden">
          <div className="flex border-b border-[#EAEFEF] overflow-x-auto">
            {['Specifications', 'Terms of Service', 'Insurance Policy', 'Reviews'].map((tab, i) => (
              <button key={tab} className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${i === 0 ? 'bg-[#25343F] text-white' : 'hover:bg-[#EAEFEF]'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="p-12 grid md:grid-cols-2 gap-16">
            <div>
              <h4 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                <Info size={20} className="text-[#FF9B51]" /> Technical Overview
              </h4>
              <p className="text-sm leading-relaxed opacity-70 mb-8 font-medium">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-y-4">
                {product.specs.map(spec => (
                  <div key={spec.label}>
                    <p className="text-[9px] font-black uppercase opacity-40">{spec.label}</p>
                    <p className="text-xs font-bold">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#EAEFEF] rounded-3xl p-8 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest mb-4">Rental Lifecycle</h4>
              {[
                { icon: Clock, title: '24h Support', desc: 'On-site technical support included.' },
                { icon: Wallet, title: 'Deposit Refund', desc: 'Refunded within 48h of return inspection.' },
                { icon: AlertCircle, title: 'Damage Protection', desc: 'Basic coverage included in daily rate.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon size={18} className="text-[#FF9B51]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase">{item.title}</p>
                    <p className="text-[9px] opacity-50 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}