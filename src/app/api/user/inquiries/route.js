import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role === 'agency') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get user's inquiries
    const inquiries = await db.collection('inquiries')
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich inquiries with agency information
    const enrichedInquiries = await Promise.all(
      inquiries.map(async (inquiry) => {
        try {
          const agency = await db.collection('agencies')
            .findOne({ _id: new ObjectId(inquiry.agencyId) });
          
          return {
            ...inquiry,
            agencyName: agency?.name || 'Unknown Agency',
            agencyImage: agency?.image || null
          };
        } catch (error) {
          return {
            ...inquiry,
            agencyName: 'Unknown Agency',
            agencyImage: null
          };
        }
      })
    );
    
    return NextResponse.json(enrichedInquiries);
  } catch (error) {
    console.error('Error fetching user inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}