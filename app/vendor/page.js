'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Activity,
  LayoutGrid,
  List,
  Calendar,
  Hash,
  ArrowRight,
  Clock,
  AlertCircle,
  IndianRupee,
  Search,
  User as UserIcon,
  Settings,
  LogOut,
  Heart,
  ShoppingCart,
  FileText,
  Plus,
  Minus,
  Package,
  BarChart3
} from 'lucide-react'
import { toast } from '../../lib/toast'

const VendorDashboard = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [viewMode, setViewMode] = useState('kanban')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  // Check auth and fetch vendor customers
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.role !== 'VENDOR') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchCustomers()
    }
  }, [status, session, router])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vendor/customers')
      if (!response.ok) throw new Error('Failed to fetch customers')
      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Failed to load customers')
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#EAEFEF] flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto mb-4 opacity-30 animate-pulse" />
          <p className="text-sm font-bold opacity-50">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.companyName?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-[#EAEFEF] font-sans text-[#25343F]">
      {/* Navbar */}
      <nav className="p-6 sticky top-0 z-50 bg-white border-b border-[#BFC9D1] shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Activity size={28} style={{ color: '#FF9B51' }} /> PRO<span className="opacity-60">RENT</span>
            </Link>
            <div className="hidden lg:flex ml-70 space-x-6 text-[10px] font-black uppercase tracking-widest opacity-70">
              <button className="hover:text-[#FF9B51] flex items-center gap-1">
                 <Link href="/vendor/orders">Orders</Link>
              </button>
              <button  className="hover:text-[#FF9B51] transition">
                <Link href="/vendor/customersdetails">Customers</Link>
              </button>
              <Link href="/vendor/products" className="hover:text-[#FF9B51] flex items-center gap-1">
                Products
              </Link>
              <Link href="/vendor/reports" className="hover:text-[#FF9B51] flex items-center gap-1">
                Reports
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-[#BFC9D1] pr-6">
              <button className="relative hover:text-[#FF9B51] transition">
                <Heart size={20} />
                <span className="absolute -top-2 -right-2 bg-[#FF9B51] text-white text-[8px] px-1.5 rounded-full">0</span>
              </button>
              <Link href="/cart" className="relative hover:text-[#FF9B51] transition">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-[#25343F] text-white text-[8px] px-1.5 rounded-full">0</span>
              </Link>
            </div>

            {/* Account Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full border-2 border-[#25343F] hover:bg-[#25343F] hover:text-white transition-all group"
              >
                <UserIcon size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Account</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-[#BFC9D1] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-[#EAEFEF] bg-[#EAEFEF]/50">
                    <p className="text-[10px] font-black opacity-40 uppercase">Signed in as</p>
                    <p className="text-xs font-bold truncate text-[#FF9B51]">
                      {session?.user?.name || 'Vendor'} (VENDOR)
                    </p>
                  </div>
                  <Link href="/vendor/products" className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#EAEFEF] transition-colors">
                    <Package size={14} /> My Products
                  </Link>
                  <Link href="/vendor/orders" className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#EAEFEF] transition-colors">
                    <FileText size={14} /> My Orders
                  </Link>
                  <Link href="/vendor/reports" className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#EAEFEF] transition-colors">
                    <BarChart3 size={14} /> Reports
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#EAEFEF] transition-colors">
                    <Settings size={14} /> Settings
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-red-50 text-red-500 transition-colors border-t border-[#EAEFEF]"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              Vendor <span className="text-[#FF9B51]">Dashboard</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 flex items-center gap-2 mt-2">
              <Clock size={12} /> Manage your rentals & customers
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex bg-white p-2 rounded-3xl shadow-xl border border-[#BFC9D1]">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'kanban' ? 'bg-[#25343F] text-white' : 'text-[#25343F]'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#25343F] text-white' : 'text-[#25343F] opacity-40'}`}
              >
                <List size={20} />
              </button>
            </div>
            <Link
              href="/vendor/publish-product"
              className="bg-[#FF9B51] text-white px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition"
            >
              + Publish Product
            </Link>
          </div>
        </header>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-[#FF9B51]"
          />
        </div>

        {/* Content */}
        {viewMode === 'kanban' ? (
          <div className="text-center py-12">
            <p className="text-lg opacity-60">Kanban view coming soon</p>
          </div>
        ) : (
          // Customers List View
          <div className="space-y-6">
            {filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border-2 border-[#BFC9D1] text-center">
                <UserIcon size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold">No customers yet</p>
                <p className="text-sm opacity-60 mt-2">Your customers will appear here once they place orders.</p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-2xl p-6 border-2 border-[#BFC9D1] hover:border-[#FF9B51] transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-black uppercase">{customer.name}</h3>
                      <p className="text-sm opacity-60">{customer.email}</p>
                      {customer.companyName && (
                        <p className="text-xs opacity-50 mt-1">Company: {customer.companyName}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {customer.role && (
                        <span className="inline-block px-3 py-1 bg-[#EAEFEF] rounded-full text-[10px] font-black uppercase">
                          {customer.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Orders Section */}
                  {customer.orders && customer.orders.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase opacity-60 mb-3">Orders from this customer:</p>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {customer.orders.map((order, idx) => (
                          <div key={idx} className="bg-[#EAEFEF] rounded-lg p-3 flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Hash size={14} className="opacity-60 flex-shrink-0" />
                                <p className="text-xs font-black uppercase text-[#FF9B51] truncate">Order #{order.orderId}</p>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <IndianRupee size={14} className="opacity-60 flex-shrink-0" />
                                <p className="text-sm font-bold">₹{parseFloat(order.amountTotal).toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  {order.status}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                  order.paymentStatus === 'PAID'
                                    ? 'bg-green-100 text-green-700'
                                    : order.paymentStatus === 'PARTIAL'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {order.paymentStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm opacity-60">
                      No orders found
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default VendorDashboard
