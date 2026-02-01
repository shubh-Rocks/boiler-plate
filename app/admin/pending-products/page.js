'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Package, AlertCircle, Clock, Loader2, TrendingUp } from 'lucide-react'

export default function PendingProducts() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchPending()
  }, [status, session, router])

  const fetchPending = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/products/pending')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id) => {
    try {
      setApproving(id)
      const res = await fetch('/api/admin/products/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Approve failed')
      await fetchPending()
    } catch (err) {
      console.error(err)
      alert('Failed to approve product')
    } finally {
      setApproving(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] to-[#f0f3f6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF9B51] mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading pending products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] to-[#f0f3f6]" style={{ color: '#25343F' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#BFC9D1] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#FF9B51] rounded-lg">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-black">Product Approvals</h1>
                  <p className="text-sm text-slate-500 mt-1">Review and approve pending vendor products</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-[#FF9B51] text-white px-4 py-2 rounded-lg font-bold">
                {products.length} Pending
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-white rounded-full mb-4">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">All Products Approved!</h2>
            <p className="text-slate-500">No pending products awaiting review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl border-2 border-[#BFC9D1] shadow-sm hover:shadow-lg hover:border-[#FF9B51] transition-all duration-300 overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-[#EAEFEF] to-[#BFC9D1] overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#FF9B51]/10 group-hover:to-[#FF9B51]/5 transition-all">
                  {p.image ? (
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Package size={40} className="text-[#BFC9D1]" />
                      <span className="text-xs font-bold text-[#BFC9D1] uppercase tracking-wide">No Image</span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 bg-[#FF9B51] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                    <AlertCircle size={12} /> Pending
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Product Name */}
                  <h3 className="text-xl font-black mb-2 line-clamp-2 group-hover:text-[#FF9B51] transition-colors">
                    {p.name}
                  </h3>

                  {/* Vendor Info */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#EAEFEF]">
                    <div className="w-8 h-8 bg-[#EAEFEF] rounded-full flex items-center justify-center">
                      <TrendingUp size={16} className="text-[#FF9B51]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Vendor</p>
                      <p className="text-sm font-bold text-[#25343F]">
                        {p.vendor?.companyName || p.vendor?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {p.description || 'No description provided'}
                  </p>

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-[#EAEFEF]">
                    <div className="bg-[#EAEFEF] rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Category</p>
                      <p className="text-sm font-bold text-[#25343F] capitalize">
                        {p.category?.replace(/_/g, ' ').toLowerCase() || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-[#EAEFEF] rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Daily Rate</p>
                      <p className="text-sm font-black text-[#FF9B51]">
                        Rs{p.dailyRate?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="bg-[#EAEFEF] rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Stock</p>
                      <p className="text-sm font-bold text-[#25343F]">{p.totalStock || 0} units</p>
                    </div>
                    <div className="bg-[#EAEFEF] rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Status</p>
                      <p className="text-sm font-bold text-orange-600">Rentable</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => approve(p.id)}
                    disabled={approving === p.id}
                    className="w-full bg-gradient-to-r from-[#25343F] to-[#FF9B51] hover:from-[#FF9B51] hover:to-[#25343F] text-white font-black py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase text-sm tracking-widest shadow-lg hover:shadow-xl"
                  >
                    {approving === p.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Approve Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
