import { NextResponse } from 'next/server';
import { connectToDatabase } from '../lib/mongodb';

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    
    // Sample agencies data
    const sampleAgencies = [
      {
        name: "Daejeon Travel",
        description: "A Daejeon regional travel agency with 15 years of experience providing the best service to foreign tourists.",
        location: "291 Daehak-ro, Yuseong-gu, Daejeon",
        phone: "042-123-4567",
        email: "info@daejeontravel.com",
        website: "https://daejeontravel.com",
        specialties: ["Cultural Experience", "Nature Tourism", "Food Tours"],
        services: [
          "Airport Pickup/Drop-off",
          "Professional Guide Service",
          "Customized Tour Planning",
          "Accommodation Booking",
          "Transportation Assistance"
        ],
        rating: 4.8,
        reviewCount: 127,
        image: "/hero/hero1.jpg",
        tagline: "Discover Daejeon's Hidden Gems",
        gender: "Male",
        age: 32,
        hobbies: ["Photography", "Hiking", "Local Food"],
        createdAt: new Date()
      },
      {
        name: "Korean Culture Experience Center",
        description: "Special programs that allow you to experience both traditional Korean culture and the charm of modern Korea.",
        location: "121 Jungang-ro, Jung-gu, Daejeon",
        phone: "042-234-5678",
        email: "contact@kculture.kr",
        website: "https://kculture.kr",
        specialties: ["Hanbok Experience", "Traditional Crafts", "K-POP Experience"],
        services: [
          "Hanbok Rental & Photography",
          "Traditional Tea Experience",
          "K-Drama Filming Location Tours",
          "Basic Korean Language Classes",
          "Cultural Workshops"
        ],
        rating: 4.9,
        reviewCount: 89,
        image: "/hero/hero2.jpg",
        tagline: "Experience Authentic Korea",
        gender: "Female",
        age: 28,
        hobbies: ["Traditional Dance", "K-Pop", "Calligraphy"],
        createdAt: new Date()
      },
      {
        name: "Nature Love Eco Tours",
        description: "Specializing in eco-friendly tours where you can explore and heal in Daejeon's beautiful nature and ecology.",
        location: "100 Dunsan-ro, Seo-gu, Daejeon",
        phone: "042-345-6789",
        email: "nature@ecotour.co.kr",
        specialties: ["Eco Tours", "Hiking", "Nature Photography"],
        services: [
          "Gyeryongsan Trekking",
          "Geum River Ecological Exploration",
          "Wild Flower Observation Tours",
          "Bird Watching Programs",
          "Nature Photography Workshops"
        ],
        rating: 4.7,
        reviewCount: 156,
        image: "/hero/hero3.jpg",
        tagline: "Time to Become One with Nature",
        gender: "Male",
        age: 35,
        hobbies: ["Mountain Climbing", "Bird Watching", "Camping"],
        createdAt: new Date()
      },
      {
        name: "Daejeon Food Tours",
        description: "A gourmet-specialized travel agency that introduces Daejeon's hidden restaurants and traditional foods.",
        location: "777 Daejeon-ro, Dong-gu, Daejeon",
        phone: "042-456-7890",
        email: "hello@daejeonFood.com",
        specialties: ["Food Tours", "Traditional Markets", "Cooking Experiences"],
        services: [
          "Sungsimdang Bakery Tours",
          "Jungang Market Exploration",
          "Korean Traditional Meal Experience",
          "Street Food Tours",
          "Traditional Liquor Tasting"
        ],
        rating: 4.6,
        reviewCount: 203,
        image: "/hero/hero4.jpg",
        tagline: "Explore the Flavors of Daejeon",
        gender: "Female",
        age: 29,
        hobbies: ["Cooking", "Food Photography", "Wine Tasting"],
        createdAt: new Date()
      }
    ];

    // Delete existing agencies and create new ones
    await db.collection('agencies').deleteMany({});

    // Insert sample agencies
    const result = await db.collection('agencies').insertMany(sampleAgencies);
    
    return NextResponse.json({ 
      message: 'Sample agencies created successfully',
      count: result.insertedCount 
    });
  } catch (error) {
    console.error('Error creating sample agencies:', error);
    return NextResponse.json(
      { error: 'Failed to create sample agencies' },
      { status: 500 }
    );
  }
}