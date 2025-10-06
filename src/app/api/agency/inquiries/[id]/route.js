import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'agency') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    const { id } = await params;
    const { response, status } = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    // Find agency by email to get agency ID
    const agency = await db.collection('agencies')
      .findOne({ email: session.user.email });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    // If it's just a status update (for confirm), don't add response
    if (!response && status) {
      const result = await db.collection('inquiries').updateOne(
        { 
          _id: new ObjectId(id),
          agencyId: agency._id.toString()
        },
        { 
          $set: { 
            status,
            confirmedAt: status === 'confirmed' ? new Date() : undefined
          } 
        }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Inquiry not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true });
    }
    
    // Add new response to responses array
    const result = await db.collection('inquiries').updateOne(
      { 
        _id: new ObjectId(id),
        agencyId: agency._id.toString()
      },
      { 
        $push: {
          responses: {
            message: response,
            createdAt: new Date(),
            agencyId: agency._id.toString()
          }
        },
        $set: { 
          status: status || 'in-progress',
          lastResponseAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}