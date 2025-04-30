import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/db';
import { eq } from 'drizzle-orm';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('_limit') ? parseInt(searchParams.get('_limit')!) : undefined;
    
    // Fetch users from the database
    const allUsers = await db.query.users.findMany({
      limit: limit,
    });
    
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.username || !body.email) {
      return NextResponse.json(
        { error: 'Name, username, and email are required' },
        { status: 400 }
      );
    }
    
    // Insert new user
    const newUser = await db.insert(users).values({
      name: body.name,
      username: body.username,
      email: body.email,
      phone: body.phone || null,
      website: body.website || null,
      street: body.street || null,
      suite: body.suite || null,
      city: body.city || null,
      zipcode: body.zipcode || null,
      lat: body.lat || null,
      lng: body.lng || null,
      companyName: body.companyName || null,
      companyCatchPhrase: body.companyCatchPhrase || null,
      companyBs: body.companyBs || null,
    }).returning();
    
    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
