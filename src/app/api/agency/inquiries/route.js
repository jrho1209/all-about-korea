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
    
    // Find agency by email to get agency ID
    const agency = await db.collection('agencies')
      .findOne({ email: session.user.email });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }
    
    // Get inquiries for this agency using agency._id
    const inquiries = await db.collection('inquiries')
      .find({ agencyId: agency._id.toString() })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}