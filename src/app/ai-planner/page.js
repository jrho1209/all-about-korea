'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AIPlanner() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    travelDates: '',
    duration: '',
    customDuration: '',
    groupSize: '',
    totalBudget: '',
    interests: [],
    travelStyle: '',
    accommodationType: '',
    specialRequests: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const interestOptions = [
    'Culture/History', 'Nature/Scenery', 'Food/Dining', 'Shopping', 'Science/Technology', 
    'Arts/Museums', 'Festivals/Events', 'Leisure/Activities', 'Hot Springs/Healing', 'Night Views/Landscapes'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateAIPlan = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsGenerating(true);
    
    // 실제 AI API 호출 대신 샘플 데이터로 시뮬레이션
    setTimeout(() => {
      const actualDuration = formData.duration === 'custom' ? formData.customDuration : formData.duration;
      const samplePlan = {
        title: `${actualDuration}-Day Customized Daejeon Trip`,
        overview: `$${formData.totalBudget} total budget travel plan for ${formData.groupSize} people focusing on ${formData.interests.join(', ')}`,
        itinerary: [
          {
            day: 1,
            theme: 'Daejeon Science City Exploration',
            activities: [
              { time: '09:00', place: 'National Science Museum', description: 'Experience cutting-edge science at Korea\'s largest science museum' },
              { time: '12:00', place: 'Expo Park', description: 'Lunch and stroll at the 1993 Daejeon Expo memorial park' },
              { time: '15:00', place: 'Hanbat Arboretum', description: 'Natural relaxation space in the city center' },
              { time: '18:00', place: 'Sungsimdang Main Store', description: 'Dinner at Daejeon\'s representative bakery' }
            ]
          },
          {
            day: 2,
            theme: 'Harmony of Tradition and Modernity',
            activities: [
              { time: '10:00', place: 'Daecheong Lake', description: 'Enjoy beautiful lake scenery' },
              { time: '13:00', place: 'Gyejoksan Yellow Clay Trail', description: 'Healing experience walking barefoot' },
              { time: '16:00', place: 'Une Brand Cafe', description: 'Rest at a local Daejeon cafe' },
              { time: '19:00', place: 'Time World', description: 'Night views and shopping combined' }
            ]
          }
        ],
        recommendations: {
          restaurants: ['Sungsimdang', 'Daejeon Station Legend', 'Baekje Galbi', 'Yong\'s Jokbal'],
          accommodations: ['Raemian Pentaport', 'Holiday Inn Express', 'The Westin Chosun Daejeon'],
          tips: [
            'We recommend using Hanaro Card for Daejeon public transportation',
            'Visit Sungsimdang on weekday mornings for the best experience',
            'Comfortable shoes are essential for Gyejoksan Yellow Clay Trail'
          ]
        }
      };
      
      setGeneratedPlan(samplePlan);
      setIsGenerating(false);
    }, 2000);
  };

  const saveTravelPlan = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (!generatedPlan) {
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const planToSave = {
        title: generatedPlan.title,
        overview: generatedPlan.overview,
        itinerary: generatedPlan.itinerary,
        recommendations: generatedPlan.recommendations,
        formData: {
          duration: formData.duration,
          customDuration: formData.customDuration,
          groupSize: formData.groupSize,
          totalBudget: formData.totalBudget,
          interests: formData.interests,
          travelStyle: formData.travelStyle
        }
      };

      const response = await fetch('/api/travel-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planToSave)
      });

      const result = await response.json();

      if (response.ok) {
        setSaveMessage('Travel plan saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        throw new Error(result.error || 'Failed to save travel plan');
      }
    } catch (error) {
      console.error('Error saving travel plan:', error);
      setSaveMessage('Failed to save travel plan. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F8F4EC'}}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4" style={{color: '#B71C1C'}}>
            AI Daejeon Travel Planner
          </h1>
          <p className="text-sm md:text-lg" style={{color: '#8D6E63'}}>
            AI creates personalized Daejeon travel plans just for you
          </p>
        </div>

        {!generatedPlan ? (
          /* Planning Form */
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
            <h2 className="text-lg md:text-2xl font-bold mb-6" style={{color: '#2E2E2E'}}>
              Please enter your travel information
            </h2>

            <div className="space-y-6">
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#2E2E2E'}}>
                  Trip Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Please select</option>
                  <option value="1">Day Trip</option>
                  <option value="2">2 Days 1 Night</option>
                  <option value="3">3 Days 2 Nights</option>
                  <option value="4">4 Days 3 Nights</option>
                  <option value="5">5 Days 4 Nights</option>
                  <option value="custom">Custom</option>
                </select>
                
                {formData.duration === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="number"
                      name="customDuration"
                      placeholder="Enter number of days"
                      value={formData.customDuration || ''}
                      onChange={handleInputChange}
                      min="1"
                      max="30"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#2E2E2E'}}>
                  Group Size
                </label>
                <select
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Please select</option>
                  <option value="1">Solo</option>
                  <option value="2">2 people (Couple/Friends)</option>
                  <option value="3-4">3-4 people (Small Group)</option>
                  <option value="5-8">5-8 people (Group)</option>
                  <option value="9+">9+ people</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#2E2E2E'}}>
                  Total Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    name="totalBudget"
                    value={formData.totalBudget}
                    onChange={handleInputChange}
                    placeholder="Enter total budget"
                    min="100"
                    max="50000"
                    className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{color: '#2E2E2E'}}>
                  Interests (Multiple selection allowed)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interestOptions.map(interest => (
                    <label key={interest} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#2E2E2E'}}>
                  Travel Style
                </label>
                <select
                  name="travelStyle"
                  value={formData.travelStyle}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Please select</option>
                  <option value="relaxed">Relaxed & Leisurely</option>
                  <option value="adventure">Active & Adventurous</option>
                  <option value="cultural">Cultural Experience</option>
                  <option value="food">Food Explorer</option>
                  <option value="nature">Nature & Healing</option>
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#2E2E2E'}}>
                  Special Requests (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  placeholder="Please mention accessibility needs, dietary restrictions, special purposes, etc."
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* 생성 버튼 */}
              <button
                onClick={generateAIPlan}
                disabled={isGenerating || !formData.duration || !formData.groupSize || !formData.totalBudget}
                className="w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#B71C1C'}}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI is generating your travel plan...
                  </span>
                ) : (
                  'Generate AI Travel Plan'
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Generated Plan */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl md:text-3xl font-bold mb-2" style={{color: '#B71C1C'}}>
                    {generatedPlan.title}
                  </h2>
                  <p className="text-sm md:text-base" style={{color: '#8D6E63'}}>
                    {generatedPlan.overview}
                  </p>
                </div>
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Generate New
                </button>
              </div>

              {/* Itinerary */}
              <div className="space-y-6">
                <h3 className="text-lg md:text-xl font-bold" style={{color: '#2E2E2E'}}>📅 Detailed Itinerary</h3>
                {generatedPlan.itinerary.map(day => (
                  <div key={day.day} className="border-l-4 pl-4 ml-2" style={{borderColor: '#5C7F9A'}}>
                    <h4 className="font-bold text-base md:text-lg mb-3" style={{color: '#5C7F9A'}}>
                      Day {day.day}: {day.theme}
                    </h4>
                    <div className="space-y-3">
                      {day.activities.map((activity, idx) => (
                        <div key={idx} className="flex gap-4">
                          <span className="text-sm font-medium text-gray-500 min-w-[50px]">
                            {activity.time}
                          </span>
                          <div>
                            <p className="font-medium text-sm md:text-base" style={{color: '#2E2E2E'}}>
                              {activity.place}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-base mb-3" style={{color: '#2E2E2E'}}>🍽️ Recommended Restaurants</h4>
                  <ul className="space-y-1">
                    {generatedPlan.recommendations.restaurants.map((restaurant, idx) => (
                      <li key={idx} className="text-sm text-gray-600">• {restaurant}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-base mb-3" style={{color: '#2E2E2E'}}>🏨 Recommended Accommodations</h4>
                  <ul className="space-y-1">
                    {generatedPlan.recommendations.accommodations.map((accommodation, idx) => (
                      <li key={idx} className="text-sm text-gray-600">• {accommodation}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Travel Tips */}
              <div className="mt-6">
                <h4 className="font-bold text-base mb-3" style={{color: '#2E2E2E'}}>💡 Travel Tips</h4>
                <ul className="space-y-1">
                  {generatedPlan.recommendations.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-gray-600">• {tip}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                {/* Save Message */}
                {saveMessage && (
                  <div className={`p-3 rounded-lg text-center text-sm font-medium ${
                    saveMessage.includes('successfully') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {saveMessage}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={saveTravelPlan}
                    disabled={isSaving}
                    className="flex-1 py-3 px-6 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{backgroundColor: '#B71C1C'}}
                  >
                    {isSaving ? 'Saving...' : 'Save Travel Plan'}
                  </button>
                  <Link 
                    href="/agencies"
                    className="flex-1 py-3 px-6 rounded-lg font-medium text-center border-2 transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: '#5C7F9A',
                      borderColor: '#5C7F9A',
                      color: 'white'
                    }}
                  >
                    Consult with Professional Agencies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Why AI Planner */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-4 md:p-8">
          <h3 className="text-lg md:text-xl font-bold mb-4" style={{color: '#2E2E2E'}}>
            Why Choose AI Travel Planner?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{backgroundColor: '#F8F4EC'}}>
                <span className="text-xl">⚡</span>
              </div>
              <h4 className="font-medium mb-2" style={{color: '#2E2E2E'}}>Fast Planning</h4>
              <p className="text-sm text-gray-600">Customized travel plans completed in minutes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{backgroundColor: '#F8F4EC'}}>
                <span className="text-xl">🎯</span>
              </div>
              <h4 className="font-medium mb-2" style={{color: '#2E2E2E'}}>Personalized</h4>
              <p className="text-sm text-gray-600">Plans reflecting your preferences and style</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{backgroundColor: '#F8F4EC'}}>
                <span className="text-xl">💰</span>
              </div>
              <h4 className="font-medium mb-2" style={{color: '#2E2E2E'}}>Cost Effective</h4>
              <p className="text-sm text-gray-600">Free AI travel planning service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}