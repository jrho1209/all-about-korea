import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid agency ID' },
        { status: 400 }
      );
    }
    
    const agency = await db.collection('agencies').findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(agency);
  } catch (error) {
    console.error('Error fetching agency:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agency' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    const updateData = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid agency ID' },
        { status: 400 }
      );
    }
    
    updateData.updatedAt = new Date();
    
    const result = await db.collection('agencies').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating agency:', error);
    return NextResponse.json(
      { error: 'Failed to update agency' },
      { status: 500 }
    );
  }
}