'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Activity,
  ArrowLeft,
  TrendingUp,
  Package,
  FileText,
  BarChart3,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const CHART_COLORS = ['#FF9B51', '#25343F', '#BFC9D1', '#EAEFEF']

export default function VendorReportsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      fetchReports()
    }
  }, [status, session, router])

  const fetchReports = async () => {
    setError(null)
    try {
      const res = await fetch('/api/vendor/reports')
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to fetch reports')
      }
      setData(json)
    } catch (err) {
      console.error(err)
      setError(err.message)
      setData({ stats: { totalRevenue: 0, totalOrders: 0, productCount: 0 }, charts: { revenueByMonth: [], ordersByStatus: [] } })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#EAEFEF] flex items-center justify-center">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-4 text-[#25343F] opacity-30 animate-pulse" />
          <p className="text-sm font-bold text-[#25343F]/60">Loading reports...</p>
        </div>
      </div>
    )
  }

  const { stats, charts } = data || {}
  const { totalRevenue = 0, totalOrders = 0, productCount = 0 } = stats || {}
  const { revenueByMonth = [], ordersByStatus = [] } = charts || {}

  return (
    <div className="min-h-screen bg-[#EAEFEF] font-sans text-[#25343F]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#BFC9D1] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/vendor"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#25343F]/70 hover:text-[#FF9B51] transition"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <Link href="/vendor" className="flex items-center gap-2">
            <Activity size={20} className="text-[#FF9B51]" />
            <span className="font-black tracking-tighter">PRO<span className="opacity-60">RENT</span></span>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 pb-20">
        <header className="mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            <span className="text-[#FF9B51]">Reports</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">
            Your rental performance overview
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={fetchReports} className="text-xs font-bold text-red-600 hover:underline">
                Retry
              </button>
            </div>
          )}
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-[#BFC9D1]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#EAEFEF] flex items-center justify-center">
                <TrendingUp size={18} className="text-[#FF9B51]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Revenue</span>
            </div>
            <p className="text-2xl font-black">₹{Number(totalRevenue).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#BFC9D1]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#EAEFEF] flex items-center justify-center">
                <FileText size={18} className="text-[#25343F]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Orders</span>
            </div>
            <p className="text-2xl font-black">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#BFC9D1]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#EAEFEF] flex items-center justify-center">
                <Package size={18} className="text-[#25343F]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Products</span>
            </div>
            <p className="text-2xl font-black">{productCount}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-[#BFC9D1]">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-[#25343F]/80">
              Revenue (Last 6 Months)
            </h2>
            {revenueByMonth?.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#BFC9D1" opacity={0.5} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#25343F' }} stroke="#BFC9D1" />
                    <YAxis tick={{ fontSize: 11, fill: '#25343F' }} stroke="#BFC9D1" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #BFC9D1', borderRadius: 12 }}
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                      labelStyle={{ color: '#25343F' }}
                    />
                    <Bar dataKey="revenue" fill="#FF9B51" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-[#25343F]/40 text-sm">
                No revenue data yet
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#BFC9D1]">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-[#25343F]/80">
              Orders by Status
            </h2>
            {ordersByStatus?.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ status, count }) => `${status}: ${count}`}
                      labelLine={false}
                    >
                      {ordersByStatus.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #BFC9D1', borderRadius: 12 }}
                      formatter={(value, name) => [value, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-[#25343F]/40 text-sm">
                No orders yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
