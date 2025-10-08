import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { db } = await connectToDatabase();
    const agenciesCollection = db.collection('agencies');
    const usersCollection = db.collection('manual_users');

    // Check if email already exists in users
    const existingUser = await usersCollection.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create agency document
    const agencyData = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      location: body.location || '',
      specialties: body.specialties || [],
      description: body.description || '',
      aboutMe: body.aboutMe || '', // Add aboutMe field
      tagline: body.tagline || '',
      rating: body.rating || 0,
      image: body.image || '',
      travelPhotos: body.travelPhotos || [], // Add travel photos array
      bio: {
        gender: body.bio?.gender || '',
        age: body.bio?.age || '',
        hobbies: body.bio?.hobbies || ''
      },
      createdAt: new Date(),
      isActive: true
    };

    // Create user account for agency login
    const userData = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: 'agency',
      createdAt: new Date()
    };

    // Insert both documents
    const [agencyResult, userResult] = await Promise.all([
      agenciesCollection.insertOne(agencyData),
      usersCollection.insertOne(userData)
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Agency and login account created successfully',
      agencyId: agencyResult.insertedId,
      userId: userResult.insertedId
    });

  } catch (error) {
    console.error('Error registering agency:', error);
    return NextResponse.json(
      { success: false, message: 'Error registering agency' },
      { status: 500 }
    );
  }
}