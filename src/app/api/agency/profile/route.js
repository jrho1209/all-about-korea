import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'agency') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find agency by email
    const agency = await db.collection('agencies')
      .findOne({ email: session.user.email });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agency);
  } catch (error) {
    console.error('Error fetching agency profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agency profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'agency') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    const { db } = await connectToDatabase();
    
    // Find agency by email
    const agency = await db.collection('agencies')
      .findOne({ email: session.user.email });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    // Update agency profile
    const result = await db.collection('agencies').updateOne(
      { email: session.user.email },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating agency profile:', error);
    return NextResponse.json(
      { error: 'Failed to update agency profile' },
      { status: 500 }
    );
  }
}