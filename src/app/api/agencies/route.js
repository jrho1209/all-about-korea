import { NextResponse } from 'next/server';
import { connectToDatabase } from '../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all agencies
    const agencies = await db.collection('agencies').find({}).toArray();
    
    return NextResponse.json(agencies);
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agencies' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const agencyData = await request.json();
    
    // Add creation timestamp
    agencyData.createdAt = new Date();
    
    const result = await db.collection('agencies').insertOne(agencyData);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating agency:', error);
    return NextResponse.json(
      { error: 'Failed to create agency' },
      { status: 500 }
    );
  }
}