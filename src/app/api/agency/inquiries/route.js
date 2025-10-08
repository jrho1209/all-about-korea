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

    // Enrich inquiries with user profile information
    const enrichedInquiries = await Promise.all(
      inquiries.map(async (inquiry) => {
        try {
          // First try to find user in users collection
          const user = await db.collection('users')
            .findOne({ email: inquiry.userEmail });
          
          let userImage = user?.image || null;
          
          // If no image in users collection, try to find in accounts collection
          if (!userImage) {
            const account = await db.collection('accounts')
              .findOne({ 
                provider: 'google',
                $or: [
                  { email: inquiry.userEmail },
                  { providerAccountId: { $exists: true } }
                ]
              });
            
            if (account) {
              // Get user by account userId
              const accountUser = await db.collection('users')
                .findOne({ _id: account.userId });
              userImage = accountUser?.image || null;
            }
          }
          
          return {
            ...inquiry,
            userImage: userImage
          };
        } catch (error) {
          console.error('Error fetching user info for inquiry:', error);
          return inquiry;
        }
      })
    );

    return NextResponse.json(enrichedInquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}