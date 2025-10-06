import { NextResponse } from 'next/server';
import { connectToDatabase } from '../lib/mongodb';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const contactData = await request.json();
    
    // Add creation timestamp
    contactData.createdAt = new Date();
    contactData.status = 'pending';
    
    const result = await db.collection('inquiries').insertOne(contactData);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to send inquiry' },
      { status: 500 }
    );
  }
}