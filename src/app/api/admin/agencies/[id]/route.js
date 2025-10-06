import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid agency ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const agenciesCollection = db.collection('agencies');
    const usersCollection = db.collection('manual_users');

    // First, get the agency to find the email
    const agency = await agenciesCollection.findOne({ _id: new ObjectId(id) });
    if (!agency) {
      return NextResponse.json(
        { success: false, message: 'Agency not found' },
        { status: 404 }
      );
    }

    // Delete both agency and user account
    const [agencyResult, userResult] = await Promise.all([
      agenciesCollection.deleteOne({ _id: new ObjectId(id) }),
      usersCollection.deleteOne({ email: agency.email, role: 'agency' })
    ]);

    if (agencyResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Agency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Agency and user account deleted successfully',
      deletedAgency: agencyResult.deletedCount > 0,
      deletedUser: userResult.deletedCount > 0
    });

  } catch (error) {
    console.error('Error deleting agency:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting agency' },
      { status: 500 }
    );
  }
}