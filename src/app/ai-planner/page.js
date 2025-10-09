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

  const generateNewPlan = () => {
    // 사용자 확인
    const confirmed = window.confirm(
      'Are you sure you want to start over? This will clear all your current selections and the generated plan.'
    );
    
    if (!confirmed) {
      return;
    }
    
    // 폼 데이터 초기화
    setFormData({
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
    
    // 생성된 계획 제거
    setGeneratedPlan(null);
    
    // 저장 메시지 제거
    setSaveMessage('');
    
    // 로딩 상태 초기화
    setIsGenerating(false);
    setIsSaving(false);
    
    console.log('Form and plan data reset for new generation');
    
    // 페이지 상단으로 스크롤
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const generateAIPlan = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      console.log('Sending request to AI API...');
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            duration: formData.duration,
            customDuration: formData.customDuration,
            groupSize: formData.groupSize,
            totalBudget: formData.totalBudget,
            interests: formData.interests,
            travelStyle: formData.travelStyle,
            accommodationType: formData.accommodationType,
            specialRequests: formData.specialRequests
          }
        })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const aiPlan = await response.json();
        console.log('AI plan received:', aiPlan);
        setGeneratedPlan(aiPlan);
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(`API error: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating AI plan:', error);
      alert(`AI 플랜 생성 중 오류가 발생했습니다: ${error.message}\n\n기본 플랜을 생성합니다.`);
      // 에러 발생 시 기본 플랜으로 폴백
      generateFallbackPlan();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackPlan = () => {
    const actualDuration = formData.duration === 'custom' ? formData.customDuration : formData.duration;
    const samplePlan = {
      title: `${actualDuration}일 대전 현지인 추천 여행`,
      overview: `$${formData.totalBudget} 예산으로 ${formData.groupSize} 그룹을 위한 대전 현지 맛집과 명소 중심 여행`,
      itinerary: [
        {
          day: 1,
          theme: '대전 도심 & 현지 맛집 탐방',
          activities: [
            { time: '09:00', place: '성심당 본점', description: '대전의 아침은 성심당 튀김소보로로 시작', address: '대전광역시 중구 대종로480번길 15' },
            { time: '10:30', place: '대전 중앙시장', description: '70년 전통 재래시장에서 현지 문화 체험', address: '대전광역시 중구 대종로 488' },
            { time: '12:00', place: '왕관식당', description: '현지인들이 즐겨 찾는 국밥집에서 점심', address: '대전광역시 중구 보문로 246' },
            { time: '18:00', place: '용\'s족발', description: '대전 현지인들의 저녁 맛집', address: '대전광역시 중구 중앙로121번길 33' }
          ]
        },
        {
          day: 2,
          theme: '자연과 힐링',
          activities: [
            { time: '09:00', place: '한밭수목원', description: '도심 속 거대한 자연 공간에서 산책', address: '대전광역시 서구 둔산대로 169' },
            { time: '14:00', place: '대청호 오백리길', description: '호수를 따라 걷는 아름다운 산책로', address: '대전광역시 동구 추동' },
            { time: '19:00', place: '유성온천', description: '천연 알칼리성 온천에서 하루 마무리', address: '대전광역시 유성구 온천로' }
          ]
        }
      ],
      recommendations: {
        restaurants: ['성심당 본점', '용\'s족발', '백제갈비', '왕관식당', '칼국수 명가'],
        accommodations: ['라마다 앙코르 대전', '호텔 ICC 대전', '유성 관광호텔'],
        localTips: [
          '성심당은 평일 오전에 가세요 - 줄이 짧아요',
          '대청호는 일몰 시간이 가장 아름다워요',
          '유성온천은 저녁 9시 이후가 한적해서 좋아요',
          '지하철 1호선으로 대부분 명소에 갈 수 있어요',
          '현지인들은 "어디 가유?"라고 말해요'
        ]
      }
    };
    
    setGeneratedPlan(samplePlan);
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
          travelStyle: formData.travelStyle,
          accommodationType: formData.accommodationType,
          specialRequests: formData.specialRequests
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

  // 로그인이 필요한 경우 로그인 페이지 표시
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
              Please log in to access the AI Travel Planner and create personalized travel plans for Daejeon.
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
                <li>• Save your personalized travel plans</li>
                <li>• Access your plan history</li>
                <li>• Get AI recommendations based on your preferences</li>
                <li>• Export and share your plans</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

              {/* 폼 제어 버튼들 */}
              <div className="space-y-3">
                {/* Reset Form 버튼 */}
                <button
                  onClick={() => {
                    const confirmed = window.confirm('Are you sure you want to reset all form fields?');
                    if (confirmed) {
                      setFormData({
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
                      setSaveMessage('');
                    }
                  }}
                  className="w-full py-2 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  🗑️ Reset Form
                </button>

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
                  onClick={generateNewPlan}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  Start Over
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
                          <div className="flex-1">
                            <p className="font-medium text-sm md:text-base" style={{color: '#2E2E2E'}}>
                              {activity.place}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600 mb-1">
                              {activity.description}
                            </p>
                            {activity.address && (
                              <p className="text-xs text-gray-500">
                                📍 {activity.address}
                              </p>
                            )}
                            {activity.localTip && (
                              <p className="text-xs text-blue-600 mt-1">
                                💡 {activity.localTip}
                              </p>
                            )}
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

              {/* Local Tips */}
              <div className="mt-6">
                <h4 className="font-bold text-base mb-3" style={{color: '#2E2E2E'}}>🏠 현지인 팁</h4>
                <ul className="space-y-1">
                  {(generatedPlan.recommendations.localTips || generatedPlan.recommendations.tips || []).map((tip, idx) => (
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