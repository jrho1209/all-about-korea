import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Verify the inquiry belongs to the current user
    const inquiry = await db.collection('inquiries').findOne({
      _id: new ObjectId(id),
      userEmail: session.user.email
    });

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Don't allow replies to confirmed or cancelled inquiries
    if (inquiry.status === 'confirmed' || inquiry.status === 'cancelled') {
      return NextResponse.json({ 
        error: 'Cannot reply to confirmed or cancelled inquiries' 
      }, { status: 400 });
    }

    // Add the user's reply to the responses array
    const newResponse = {
      message: message.trim(),
      timestamp: new Date(),
      sender: 'user'
    };

    // Initialize responses array if it doesn't exist
    const responses = inquiry.responses || [];
    responses.push(newResponse);

    // Update the inquiry with the new response
    await db.collection('inquiries').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          responses: responses,
          status: 'in-progress', // Update status to in-progress when user replies
          lastUpdated: new Date()
        }
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Reply sent successfully' 
    });

  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}