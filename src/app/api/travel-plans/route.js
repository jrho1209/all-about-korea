import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import clientPromise from '../auth/[...nextauth]/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - 사용자의 저장된 여행 계획들 조회
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('travel_database');
    const collection = db.collection('travel_plans');

    // 사용자의 여행 계획들 조회
    const travelPlans = await collection
      .find({ userEmail: session.user.email })
      .sort({ savedAt: -1 })
      .toArray();

    return NextResponse.json(travelPlans);
  } catch (error) {
    console.error('Error fetching travel plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - 새로운 여행 계획 저장
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const planData = await request.json();
    
    const client = await clientPromise;
    const db = client.db('travel_database');
    const collection = db.collection('travel_plans');

    const travelPlan = {
      ...planData,
      userEmail: session.user.email,
      userName: session.user.name,
      savedAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(travelPlan);

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Travel plan saved successfully' 
    });
  } catch (error) {
    console.error('Error saving travel plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - 여행 계획 삭제
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('id');

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('travel_database');
    const collection = db.collection('travel_plans');

    const result = await collection.deleteOne({ 
      _id: new ObjectId(planId),
      userEmail: session.user.email 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Travel plan not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Travel plan deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting travel plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}