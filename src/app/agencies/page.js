"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import PageHero from "../components/PageHero/PageHero";

export default function AgenciesPage() {
  const { data: session } = useSession();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      console.log('Fetching agencies...');
      const response = await fetch('/api/agencies');
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Agencies data:', data);
        console.log('Number of agencies:', data.length);
        setAgencies(data);
      } else {
        console.error('Failed to fetch agencies:', response.status);
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F8F4EC'}}>
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4" style={{color: '#B71C1C'}}>
              Login Required
            </h2>
            
            <p className="text-gray-600 mb-6">
              Please log in to access Travel Agencies and connect with verified travel service providers in Korea.
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/login"
                className="w-full block py-3 px-4 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
                style={{backgroundColor: '#B71C1C'}}
              >
                Login to Continue
              </Link>
              
              <Link 
                href="/signup"
                className="w-full block py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Create New Account
              </Link>
              
              <Link 
                href="/"
                className="block text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Why do I need to log in?</h3>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Access verified travel agencies</li>
                <li>• Save your favorite agencies</li>
                <li>• Contact agencies directly</li>
                <li>• Read and write reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading agencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {agencies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No agencies registered yet</h3>
            <p className="text-gray-600">Amazing travel agency partners will be added soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agencies.map((agency) => (
              <div key={agency._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-[480px] flex flex-col">
                {/* Profile Header with Background */}
                <div className="relative h-32 bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 flex-shrink-0">
                  {agency.backgroundImage ? (
                    <img 
                      src={agency.backgroundImage} 
                      alt={`${agency.name} background`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500 via-pink-500 to-orange-500"></div>
                  )}
                </div>
                
                {/* Profile Picture - Fixed Position */}
                <div className="relative px-6 pb-6 flex-1 flex flex-col">
                  <div className="flex justify-center" style={{ marginTop: '-48px' }}>
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden">
                        {agency.image ? (
                          <img 
                            src={agency.image} 
                            alt={agency.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-3xl text-gray-400">🏢</div>
                        )}
                      </div>
                      {/* Online Status Indicator */}
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Info - Fixed spacing */}
                  <div className="text-center flex-1 flex flex-col" style={{ marginTop: '16px' }}>
                    <div className="flex-shrink-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 h-7 flex items-center justify-center">{agency.name}</h3>
                      <div className="h-5 mb-2">
                        {agency.tagline && (
                          <p className="text-sm text-gray-500">{agency.tagline}</p>
                        )}
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-center mb-3 h-8">
                        <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-sm font-medium text-gray-700 ml-1">
                            {agency.rating || 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({agency.reviewCount || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Specialties Badges */}
                    <div className="flex-1 flex flex-col justify-start">
                      <div className="min-h-[60px] flex items-start justify-center mb-4">
                        {agency.specialties && agency.specialties.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1">
                            {agency.specialties.slice(0, 3).map((specialty, index) => (
                              <span key={index} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                {specialty}
                              </span>
                            ))}
                            {agency.specialties.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                +{agency.specialties.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      

                    </div>
                    
                    {/* Action Button - Always at bottom */}
                    <div className="mt-auto flex-shrink-0">
                      <Link 
                        href={`/agencies/${agency._id}`}
                        className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors text-center"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}