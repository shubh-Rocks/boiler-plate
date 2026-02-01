import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getServerSessionHelper } from '../../../../lib/auth'

export async function GET() {
  try {
    const session = await getServerSessionHelper()
    if (!session?.user || session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vendorId = parseInt(session.user.id)
    if (!Number.isFinite(vendorId)) {
      return NextResponse.json({ error: 'Invalid vendor' }, { status: 400 })
    }

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const [
      vendorOrders,
      paidInvoices,
      productCount,
    ] = await Promise.all([
      prisma.order.findMany({
        where: {
          items: { some: { product: { vendorId } } },
        },
        include: { invoice: true },
      }),
      prisma.invoice.findMany({
        where: {
          status: 'PAID',
          order: {
            items: { some: { product: { vendorId } } },
          },
          issuedAt: { gte: sixMonthsAgo },
        },
        select: { amountPaid: true, issuedAt: true },
      }),
      prisma.product.count({ where: { vendorId } }),
    ])

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + Number(inv.amountPaid || 0), 0)
    const totalOrders = vendorOrders.length

    const monthlyRevenue = {}
    paidInvoices.forEach((inv) => {
      const month = inv.issuedAt.toISOString().substring(0, 7)
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(inv.amountPaid || 0)
    })

    // Always return last 6 months (pad with 0 for months with no revenue)
    const revenueByMonth = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthKey = d.toISOString().substring(0, 7)
      const revenue = monthlyRevenue[monthKey] || 0
      revenueByMonth.push({
        month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: Number(revenue.toFixed(2)),
      })
    }

    const statusCounts = {}
    vendorOrders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
    })
    const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status: status.replace(/_/g, ' '),
      count,
    }))

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        productCount,
      },
      charts: {
        revenueByMonth,
        ordersByStatus,
      },
    })
  } catch (error) {
    console.error('Vendor reports error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
