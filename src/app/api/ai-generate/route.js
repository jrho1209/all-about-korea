import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { daejeonLocalData, getLocalRecommendations } from '../../data/daejeonLocalData';

export async function POST(request) {
  try {
    console.log('AI Generate API called');
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { formData } = await request.json();
    console.log('Form data received:', formData);
    
    // OpenAI API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not found, using local data only');
      const localPlan = generateLocalPlan(formData);
      return NextResponse.json(localPlan);
    }

    console.log('OpenAI API key found, attempting AI generation');

    // OpenAI API 호출
    try {
      const aiPlan = await generateAIPlan(formData);
      console.log('AI plan generated successfully');
      return NextResponse.json(aiPlan);
    } catch (aiError) {
      console.error('OpenAI API error, falling back to local data:', aiError);
      const localPlan = generateLocalPlan(formData);
      return NextResponse.json(localPlan);
    }

  } catch (error) {
    console.error('Error in AI planner API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

async function generateAIPlan(formData) {
  const localRecommendations = getLocalRecommendations(
    formData.interests || [],
    formData.groupSize || '2-3',
    parseFloat(formData.totalBudget) || 500
  );

  const duration = formData.duration === 'custom' 
    ? parseInt(formData.customDuration) || 3
    : parseInt(formData.duration?.split('-')[0]) || 3;

  const prompt = `
STEP-BY-STEP ANALYSIS REQUIRED:

1. BUDGET ANALYSIS:
   - Total budget: $${formData.totalBudget || 500}
   - Daily budget: $${Math.floor((formData.totalBudget || 500) / duration)}
   - Group size: ${formData.groupSize || '2-3 people'}
   - Calculate per-person daily budget and recommend appropriate price tier restaurants

2. INTEREST MATCHING:
   - Primary interests: ${(formData.interests || []).join(', ')}
   - Match each interest with specific local attractions from the data below
   - Travel style: ${formData.travelStyle || 'general'} - adjust pace and activity intensity accordingly
   - Accommodation preference: ${formData.accommodationType || 'any type'}

3. SPECIAL REQUIREMENTS (CRITICAL - MUST FOLLOW):
   ${formData.specialRequests ? `- IMPORTANT SPECIAL REQUESTS: ${formData.specialRequests}` : '- No special requests specified'}
   - ABSOLUTELY MUST incorporate all special requirements into every recommendation
   - If user dislikes certain foods/places, NEVER recommend them
   - Special requests take PRIORITY over default recommendations
   - Filter out ANY venues that conflict with special requests
   - Double-check all restaurant and activity recommendations against special requests

4. LOGICAL FLOW PLANNING:
   - Consider geographical proximity of locations
   - Account for opening hours and best visiting times
   - Balance meals, activities, and travel time
   - Factor in group size for restaurant capacity and activity suitability

5. LOCAL DATA INTEGRATION:
   Use ONLY the following verified local information:

RESTAURANTS (with exact details):
${localRecommendations.restaurants.map(r => 
  `• ${r.name}
    Address: ${r.address}
    Phone: ${r.phone}
    Description: ${r.description}
    Local Insider Tip: ${r.localTip}
    Price Range: ${r.priceRange}
    Operating Hours: ${r.openHours}
    Specialty: ${r.specialty}`
).join('\n\n')}

ATTRACTIONS (with exact details):
${daejeonLocalData.attractions.map(a => 
  `• ${a.name}
    Address: ${a.address}
    Phone: ${a.phone || 'N/A'}
    Description: ${a.description}
    Local Insider Tip: ${a.localTip}
    Best Visit Time: ${a.bestTime}
    Activities: ${a.activity}
    Access Info: ${a.accessInfo}`
).join('\n\n')}

6. CULTURAL CONTEXT:
   Incorporate these local cultural insights:
   ${daejeonLocalData.culturalTips.map(tip => `   • ${tip}`).join('\n')}

THINKING PROCESS (show your work):
- First, analyze the budget per person per day
- Then, match interests to specific attractions from the data
- Consider any special requests and incorporate them into planning
- Plan logical daily routes considering location proximity
- Select restaurants that fit budget and group size
- Add authentic local tips that only a 20-year resident would know

MANDATORY CONSTRAINTS (MUST FOLLOW):

1. DATA FIDELITY RULES:
   ✓ ONLY use restaurant names, addresses, and phone numbers from the provided local data
   ✓ NEVER invent or modify addresses or contact information
   ✓ If recommending a restaurant, it MUST exist in the local data above
   ✓ All activities must reference real locations with verified details

2. BUDGET COMPLIANCE RULES:
   ✓ Total plan cost must not exceed stated budget
   ✓ Recommend restaurants matching budget tier:
     - Budget (<$300): Focus on ₩5,000-15,000 range restaurants
     - Mid-range ($300-700): Include ₩15,000-35,000 range options
     - Premium (>$700): Include all price ranges
   ✓ Factor in transportation costs (subway ₩1,370 per ride)

3. GROUP SIZE OPTIMIZATION:
   ✓ For 1-2 people: Recommend intimate dining spots
   ✓ For 3-4 people: Ensure restaurants can accommodate groups
   ✓ For 5+ people: Suggest venues with larger seating capacity

4. TEMPORAL LOGIC RULES:
   ✓ Respect restaurant operating hours from local data
   ✓ Plan logical travel sequences (nearby locations together)
   ✓ Account for attraction best visiting times
   ✓ Allow realistic travel time between locations

5. AUTHENTICITY REQUIREMENTS:
   ✓ Include specific local dialect phrases and cultural insights
   ✓ Mention seasonal considerations from local data
   ✓ Provide insider tips that only locals would know
   ✓ Reference specific transportation details (stations, exits)

OUTPUT FORMAT (STRICT JSON):
{
  "title": "${duration}-Day Daejeon Local Travel Plan",
  "overview": "Travel overview in English",
  "itinerary": [
    {
      "day": 1,
      "theme": "Day theme in English",
      "activities": [
        {
          "time": "HH:MM",
          "place": "EXACT name from local data",
          "description": "Detailed description in English",
          "address": "EXACT address from local data",
          "localTip": "Insider tip only locals would know",
          "contact": "EXACT phone number from local data or empty string"
        }
      ]
    }
  ],
  "recommendations": {
    "restaurants": ["Names from provided data only"],
    "accommodations": ["Local accommodation suggestions"],
    "localTips": ["Cultural and practical insights"]
  }
}

VALIDATION CHECKLIST BEFORE RESPONDING:
□ All restaurant names match provided data exactly
□ All addresses are copied exactly from local data
□ All phone numbers are accurate or empty
□ Budget calculations are realistic
□ Travel timing is logical and feasible
□ Cultural insights are authentic and specific
□ CRITICAL: All special requests are respected (NO conflicting recommendations)
□ If user dislikes bread/bakery, NO bakery recommendations
□ If user has dietary restrictions, ALL restaurants must accommodate them

IMPORTANT: Please respond ONLY in English for international visitors.
`;

  // Fine-tuned 모델 사용 여부 확인
  const useFineTunedModel = process.env.USE_FINE_TUNED_MODEL === 'true';
  const fineTunedModelId = process.env.FINE_TUNED_MODEL_ID;
  
  // 모델 선택 (Fine-tuned 모델이 있으면 사용, 없으면 기본 모델)
  const selectedModel = (useFineTunedModel && fineTunedModelId) 
    ? fineTunedModelId 
    : 'gpt-3.5-turbo';

  console.log(`Using model: ${selectedModel}`);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: useFineTunedModel && fineTunedModelId ? [
        // Fine-tuned 모델용 간단한 프롬프트 (이미 훈련되어 있음)
        {
          role: 'system',
          content: 'You are a Daejeon travel expert. Create detailed travel plans using the provided local data. CRITICAL: Always respect and follow special requests - if someone dislikes bread/bakery, NEVER recommend bakeries.'
        },
        {
          role: 'user',
          content: `Create a ${duration}-day travel plan for ${formData.groupSize || '2-3 people'} with $${formData.totalBudget || 500} budget, interested in ${(formData.interests || []).join(', ')}, ${formData.travelStyle || 'general'} style.
${formData.accommodationType ? `Accommodation preference: ${formData.accommodationType}` : ''}
${formData.specialRequests ? `IMPORTANT SPECIAL REQUESTS - MUST FOLLOW: ${formData.specialRequests}` : ''}

Local Data:
${localRecommendations.restaurants.map(r => `${r.name} - ${r.address} (${r.phone}) - ${r.description} - ${r.localTip} - ${r.priceRange}`).join('\n')}

${daejeonLocalData.attractions.map(a => `${a.name} - ${a.address} - ${a.description} - ${a.localTip} - ${a.bestTime}`).join('\n')}

REMEMBER: If special requests mention food dislikes, exclude those types of venues completely. Respond in JSON format.`
        }
      ] : [
        // 기본 모델용 상세한 프롬프트
        {
          role: 'system',
          content: `You are an expert local guide who has lived in Daejeon for over 20 years. You specialize in creating personalized travel plans for international visitors.

TRAINING EXAMPLES:

Example 1 - Budget Travel Plan:
Input: 2-day trip, 2 people, $200 budget, Nature/Scenery interest
Output: {
  "title": "2-Day Budget Daejeon Nature Experience",
  "overview": "Affordable nature-focused plan for 2 people exploring Daejeon's beautiful natural attractions within $200 budget",
  "itinerary": [
    {
      "day": 1,
      "theme": "Lake and Mountain Discovery",
      "activities": [
        {
          "time": "09:00",
          "place": "Sungsimdang Main Store",
          "description": "Start with affordable breakfast at Daejeon's most famous bakery",
          "address": "15, Daejong-ro 480beon-gil, Jung-gu, Daejeon",
          "localTip": "Try the fried croquette bread - it's only ₩2,000 and very filling",
          "contact": "042-253-3535"
        },
        {
          "time": "11:00",
          "place": "Daecheongho Lake 500-ri Trail",
          "description": "Free scenic walk along the beautiful lake trail",
          "address": "Chu-dong, Dong-gu, Daejeon",
          "localTip": "Bring your own water and snacks - no entry fee required",
          "contact": ""
        }
      ]
    }
  ],
  "recommendations": {
    "restaurants": ["Sungsimdang Main Store", "Kalguksu Master"],
    "accommodations": ["Budget guesthouses near Yuseong"],
    "localTips": ["Use subway day pass for ₩4,500", "Many attractions are free", "Eat at local markets for budget meals"]
  }
}

Example 2 - Luxury Travel Plan:
Input: 3-day trip, 4 people, $1000 budget, Food/Dining + Hot Springs interest
Output: {
  "title": "3-Day Premium Daejeon Culinary & Wellness Experience",
  "overview": "Luxurious food and wellness journey for 4 people discovering Daejeon's finest restaurants and premium hot springs",
  "itinerary": [
    {
      "day": 1,
      "theme": "Premium Dining Experience",
      "activities": [
        {
          "time": "12:00",
          "place": "Baekje Galbi",
          "description": "Experience 50-year tradition Korean BBQ with premium galbi sets",
          "address": "211, Daedeok-daero, Seo-gu, Daejeon",
          "localTip": "Order the premium galbi course - perfect for groups of 4",
          "contact": "042-525-0011"
        }
      ]
    }
  ]
}

INSTRUCTIONS:
1. Always use the provided local data for accurate addresses and phone numbers
2. Match the budget level - suggest appropriate restaurants and activities
3. Incorporate the specific interests mentioned
4. Include practical local tips that only a 20-year resident would know
5. Provide exact addresses and contact information when available
6. Structure activities with realistic timing and logical flow
7. Consider group size for restaurant recommendations and activity planning

Using the provided local information, create accurate travel plans with addresses and phone numbers in JSON format. Respond ONLY in English for international visitors.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // 낮은 temperature로 일관성 향상
      max_tokens: 3000, // 더 긴 응답 허용
      top_p: 0.9, // 품질 높은 토큰 선택
      frequency_penalty: 0.1, // 반복 줄이기
      presence_penalty: 0.1 // 다양성 약간 증가
    })
  });

  console.log('OpenAI response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error details:', errorData);
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  console.log('OpenAI response received');
  
  const aiContent = data.choices[0].message.content;
  console.log('AI Content:', aiContent);

  // AI 응답을 파싱하여 구조화된 데이터로 변환
  try {
    // JSON 부분만 추출 (AI가 설명과 함께 응답할 수 있으므로)
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedPlan = JSON.parse(jsonMatch[0]);
      console.log('Successfully parsed AI plan');
      return parsedPlan;
    } else {
      throw new Error('No JSON found in AI response');
    }
  } catch (parseError) {
    console.warn('Failed to parse AI response:', parseError);
    console.log('Raw AI response:', aiContent);
    // JSON 파싱 실패 시 로컬 데이터로 폴백
    throw new Error('Failed to parse AI response');
  }
}

function generateLocalPlan(formData) {
  console.log('Generating local plan with formData:', formData);
  
  const localRecommendations = getLocalRecommendations(
    formData.interests || [],
    formData.groupSize || '2-3',
    parseFloat(formData.totalBudget) || 500
  );

  const duration = formData.duration === 'custom' 
    ? parseInt(formData.customDuration) || 3
    : parseInt(formData.duration?.split('-')[0]) || 3;

  console.log('Duration calculated:', duration);

  // 현지 데이터를 활용한 기본 플랜 생성
  const itinerary = [];
  
  for (let day = 1; day <= duration; day++) {
    const dayPlan = {
      day,
      theme: getDayTheme(day, formData.interests || []),
      activities: getDayActivities(day, localRecommendations, formData.interests || [], formData.specialRequests)
    };
    itinerary.push(dayPlan);
  }

  const plan = {
    title: `${duration}-Day Daejeon Local Travel Plan`,
    overview: `Locally recommended Daejeon travel plan for ${formData.groupSize || '2-3 people'} group with $${formData.totalBudget || 500} budget${formData.specialRequests ? ` - Special considerations: ${formData.specialRequests}` : ''}`,
    itinerary,
    recommendations: {
      restaurants: localRecommendations.restaurants?.map(r => r.name) || ['Sungsimdang Main Store', 'Yong\'s Jokbal', 'Baekje Galbi'],
      accommodations: ['Ramada Encore Daejeon', 'ICC Hotel Daejeon', 'Yuseong Tourist Hotel'],
      localTips: [
        'Visit Sungsimdang Main Store on weekday mornings - shorter lines',
        'Daecheongho Lake is most beautiful at sunset',
        'Yuseong Hot Springs is quieter after 9 PM',
        'Subway Line 1 covers most attractions',
        'Locals say "Eodi gayu?" (Where are you going?)'
      ]
    }
  };

  console.log('Local plan generated:', plan);
  return plan;
}

function getDayTheme(day, interests) {
  const themes = {
    1: 'Daejeon City Exploration & Food Tour',
    2: 'Nature and Healing',
    3: 'Culture and Traditional Experience'
  };
  
  if (interests.includes('Food/Dining')) {
    themes[1] = 'Daejeon Local Food Discovery';
  }
  if (interests.includes('Nature/Scenery')) {
    themes[2] = 'Daejeon Natural Attractions';
  }
  if (interests.includes('Hot Springs/Healing')) {
    themes[day] = 'Hot Springs and Relaxation';
  }
  
  return themes[day] || `Daejeon Local Experience Day ${day}`;
}

function getDayActivities(day, recommendations, interests, specialRequests) {
  const restaurants = recommendations.restaurants || [];
  const attractions = daejeonLocalData.attractions;
  
  // Special requests로 인해 제외해야 할 장소들 체크
  const shouldAvoidBakery = specialRequests && (
    specialRequests.toLowerCase().includes('bread') ||
    specialRequests.toLowerCase().includes('bakery') ||
    specialRequests.toLowerCase().includes('flour')
  );
  
  const activities = [];
  
  if (day === 1) {
    // 빵/베이커리를 싫어하는 경우 다른 아침 옵션 제공
    if (!shouldAvoidBakery) {
      activities.push({
        time: '09:00',
        place: 'Sungsimdang Main Store',
        description: 'Start your Daejeon morning with famous fried croquette bread',
        address: '15, Daejong-ro 480beon-gil, Jung-gu, Daejeon',
        localTip: 'Weekday mornings have shorter lines'
      });
    } else {
      // 빵 대신 다른 아침 옵션
      activities.push({
        time: '09:00',
        place: 'Wanggwan Restaurant',
        description: 'Start with authentic Korean breakfast at traditional soup restaurant',
        address: '246, Bomun-ro, Jung-gu, Daejeon',
        localTip: 'Early morning visit ensures the richest, most concentrated broth'
      });
    }
    
    activities.push(
      {
        time: '10:30',
        place: 'Daejeon Jungang Market',
        description: '70-year traditional market for authentic local food culture',
        address: '488, Daejong-ro, Jung-gu, Daejeon',
        localTip: 'Various street foods and local dining options available'
      },
      {
        time: '12:00',
        place: restaurants[0]?.name || 'Wanggwan Restaurant',
        description: restaurants[0]?.description || 'Local favorite restaurant for lunch',
        address: restaurants[0]?.address || '246, Bomun-ro, Jung-gu, Daejeon',
        localTip: restaurants[0]?.localTip || 'Popular with locals'
      },
      {
        time: '18:00',
        place: restaurants[1]?.name || 'Yong\'s Jokbal',
        description: restaurants[1]?.description || 'Local favorite for dinner',
        address: restaurants[1]?.address || '33, Jungang-ro 121beon-gil, Jung-gu, Daejeon',
        localTip: restaurants[1]?.localTip || 'Open until late night'
      }
    );
  } else if (day === 2) {
    activities.push(
      {
        time: '09:00',
        place: 'Hanbat Arboretum',
        description: 'Walk through the vast natural space in the city center',
        address: '169, Dunsan-daero, Seo-gu, Daejeon',
        localTip: 'West garden is larger and more beautiful'
      },
      {
        time: '14:00',
        place: 'Daecheongho Lake 500-ri Trail',
        description: 'Beautiful walking trail along the lake',
        address: 'Chu-dong, Dong-gu, Daejeon',
        localTip: 'Most beautiful at sunset time'
      },
      {
        time: '19:00',
        place: 'Yuseong Hot Springs',
        description: 'End your day at natural alkaline hot springs',
        address: 'Oncheon-ro, Yuseong-gu, Daejeon',
        localTip: 'Quieter after 9 PM'
      }
    );
  } else {
    // Day 3 and beyond
    activities.push(
      {
        time: '09:00',
        place: 'Gyejoksan Yellow Clay Trail',
        description: 'Healing barefoot walk on yellow clay trail',
        address: 'Jang-dong, Daedeok-gu, Daejeon',
        localTip: 'Better to walk barefoot'
      },
      {
        time: '13:00',
        place: restaurants[2]?.name || 'Baekje Galbi',
        description: restaurants[2]?.description || 'Traditional galbi restaurant',
        address: restaurants[2]?.address || '211, Daedeok-daero, Seo-gu, Daejeon',
        localTip: restaurants[2]?.localTip || 'Lunch galbi set menu offers great value'
      }
    );
  }
  
  return activities;
}