import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import clientPromise from '../auth/[...nextauth]/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('allaboutkorea');
    const users = db.collection('users');
    
    const user = await users.findOne({ email: session.user.email });
    
    return NextResponse.json({
      sessionUser: session.user,
      dbUser: user,
      subscription: user?.subscription || null
    });
  } catch (error) {
    console.error('Debug user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}