import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, name, role = 'CUSTOMER', companyName, gstin } = body

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { 
          error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        },
        { status: 400 }
      )
    }

    // Vendor-specific validation
    if (role === 'VENDOR') {
      if (!companyName || !gstin) {
        return NextResponse.json(
          { error: 'Company name and GSTIN are required for vendor registration' },
          { status: 400 }
        )
      }
      
      // GSTIN validation (15 characters, alphanumeric)
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
      if (!gstinRegex.test(gstin)) {
        return NextResponse.json(
          { error: 'Invalid GSTIN format. GSTIN must be 15 characters and follow the standard format.' },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        companyName: role === 'VENDOR' ? companyName : null,
        gstin: role === 'VENDOR' ? gstin : null
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true
      }
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
