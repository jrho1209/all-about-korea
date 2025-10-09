// Daejeon Local Recommendations by Locals - English Version for International Visitors
export const daejeonLocalData = {
  restaurants: [
    {
      name: "Sungsimdang Main Store",
      category: "Bakery/Cafe",
      address: "15, Daejong-ro 480beon-gil, Jung-gu, Daejeon",
      phone: "042-253-3535",
      description: "Daejeon's representative bakery, famous for fried croquette bread and chive bread",
      localTip: "Visit on weekday mornings to avoid long lines - weekends get very crowded",
      priceRange: "₩5,000-15,000",
      openHours: "07:00-22:00",
      specialty: "Fried Croquette Bread, Chive Bread, Butter Cream Bun",
      coordinates: { lat: 36.3265, lng: 127.4194 }
    },
    {
      name: "Yong's Jokbal",
      category: "Pig's Trotters/Bossam",
      address: "33, Jungang-ro 121beon-gil, Jung-gu, Daejeon",
      phone: "042-222-0008",
      description: "Local favorite for pig's trotters, beloved by Daejeon residents",
      localTip: "Open until late night - perfect for ending a drinking session",
      priceRange: "₩25,000-40,000",
      openHours: "17:00-04:00",
      specialty: "Pig's Trotters, Bossam, Cold Buckwheat Noodles",
      coordinates: { lat: 36.3285, lng: 127.4203 }
    },
    {
      name: "Baekje Galbi",
      category: "Korean BBQ/Ribs",
      address: "211, Daedeok-daero, Seo-gu, Daejeon",
      phone: "042-525-0011",
      description: "50-year tradition Daejeon galbi restaurant",
      localTip: "Lunch galbi set menu offers great value for money",
      priceRange: "₩15,000-35,000",
      openHours: "11:30-22:00",
      specialty: "Grilled Ribs, Galbi Set Menu, Galbi Soup",
      coordinates: { lat: 36.3512, lng: 127.3845 }
    },
    {
      name: "Wanggwan Restaurant",
      category: "Korean Soup/Gukbap",
      address: "246, Bomun-ro, Jung-gu, Daejeon",
      phone: "042-253-1142",
      description: "Traditional soup restaurant favored by locals",
      localTip: "Visit early morning for richer, more concentrated broth",
      priceRange: "₩8,000-12,000",
      openHours: "06:00-20:00",
      specialty: "Sundae Gukbap, Pork Soup, Head Meat",
      coordinates: { lat: 36.3298, lng: 127.4276 }
    },
    {
      name: "Kalguksu Master",
      category: "Korean Noodles",
      address: "123-45, Wolpyeong-dong, Seo-gu, Daejeon",
      phone: "042-472-2828",
      description: "Hand-pulled noodle soup specialty restaurant",
      localTip: "Their kimchi is incredibly delicious and refills are free",
      priceRange: "₩7,000-10,000",
      openHours: "10:00-21:00",
      specialty: "Hand-pulled Noodle Soup, Dumplings, Kimchi",
      coordinates: { lat: 36.3498, lng: 127.3756 }
    }
  ],
  
  attractions: [
    {
      name: "Daecheongho Lake 500-ri Trail",
      category: "Nature/Walking",
      address: "Chu-dong, Dong-gu, Daejeon",
      phone: "042-270-8332",
      description: "Lake walking trail that locals visit every weekend",
      localTip: "Visit during sunset for breathtaking views - it's a photo hotspot",
      activity: "Walking, Cycling, Cafe visits",
      accessInfo: "Take bus from Banseok Station (Subway Line 1)",
      bestTime: "4PM-6PM (sunset time)",
      coordinates: { lat: 36.4329, lng: 127.4853 }
    },
    {
      name: "Gyejoksan Yellow Clay Trail",
      category: "Nature/Hiking",
      address: "Jang-dong, Daedeok-gu, Daejeon",
      phone: "042-608-6395",
      description: "Barefoot walking yellow clay trail, perfect healing spot",
      localTip: "Better to walk barefoot than with shoes - foot spa available too",
      activity: "Clay trail walking, Foot spa, Hiking",
      accessInfo: "Take bus from Sintanjin Station (Subway Line 1)",
      bestTime: "9AM-11AM (quiet hours)",
      coordinates: { lat: 36.4158, lng: 127.4502 }
    },
    {
      name: "Hanbat Arboretum",
      category: "Nature/Botanical Garden",
      address: "169, Dunsan-daero, Seo-gu, Daejeon",
      phone: "042-270-8452",
      description: "Huge arboretum in the city center, perfect for family outings",
      localTip: "Divided into East and West gardens - West garden is larger",
      activity: "Walking, Exercise, Family outings",
      accessInfo: "Galma Station (Subway Line 1) Exit 3",
      bestTime: "10AM-4PM",
      coordinates: { lat: 36.3674, lng: 127.3891 }
    },
    {
      name: "Yuseong Hot Springs",
      category: "Hot Springs/Healing",
      address: "Oncheon-ro, Yuseong-gu, Daejeon",
      phone: "042-611-2114",
      description: "Natural alkaline hot springs, locals' healing destination",
      localTip: "Visit after 9PM for a quieter experience - check parking availability",
      activity: "Hot spring baths, Spa, Relaxation",
      accessInfo: "Yuseong Hot Springs Station (Subway Line 1)",
      bestTime: "8PM-10PM",
      coordinates: { lat: 36.3623, lng: 127.3428 }
    },
    {
      name: "Daejeon Jungang Market",
      category: "Shopping/Traditional Market",
      address: "488, Daejong-ro, Jung-gu, Daejeon",
      phone: "042-253-4829",
      description: "70-year traditional market, authentic local food paradise",
      localTip: "Visit during lunch time for more diverse food options",
      activity: "Shopping, Food tour, Cultural experience",
      accessInfo: "Jungang-ro Station (Subway Line 1) Exit 1",
      bestTime: "11AM-2PM",
      coordinates: { lat: 36.3265, lng: 127.4194 }
    }
  ],

  transportation: {
    subway: {
      line1: "Banseok → Jijok → Noeun → World Cup Stadium → Yuseong Hot Springs → Galma → Government Complex-Daejeon → City Hall → Tanbang → Yongmun → Oryong → Seodaejeon Sageori → Jungang-ro → Daejeon → Daedong → Sintanjin",
      operatingHours: "05:30-24:00",
      fare: "Adults ₩1,370, Youth ₩1,110"
    },
    bus: {
      tip: "Daejeon city buses require transit cards - ₩300 cheaper than cash",
      mainTerminals: ["Daejeon Express Bus Terminal", "East Daejeon Station", "West Daejeon Station"]
    }
  },

  culturalTips: [
    "Daejeon locals say 'Eodi gayu?' (Where are you going?) in local dialect",
    "Sungsimdang is Daejeon's pride - great for souvenirs too",
    "Many people enjoy cycling around Daecheongho Lake",
    "Yuseong Hot Springs area is more lively at night",
    "Gyejoksan Yellow Clay Trail is best experienced barefoot"
  ],

  seasons: {
    spring: {
      recommendation: "Cherry blossoms at Hanbat Arboretum, Daecheongho Lake walks",
      weather: "Large temperature differences - bring extra layers"
    },
    summer: {
      recommendation: "Yuseong Hot Springs, Gyejoksan Yellow Clay Trail (early morning)",
      weather: "Very hot - bring plenty of water"
    },
    autumn: {
      recommendation: "Fall foliage at Daecheongho Lake, Gyejoksan hiking",
      weather: "Best season - perfect for walking"
    },
    winter: {
      recommendation: "Warm bread at Sungsimdang, Yuseong Hot Springs",
      weather: "Cold and dry - moisturizer essential"
    }
  }
};

export const getLocalRecommendations = (interests, groupSize, budget) => {
  const recommendations = {
    restaurants: [],
    attractions: [],
    tips: []
  };

  // Budget-based restaurant recommendations
  if (budget < 50000) {
    recommendations.restaurants = daejeonLocalData.restaurants.filter(r => 
      r.priceRange.includes('₩5,000') || r.priceRange.includes('₩8,000') || r.priceRange.includes('₩7,000')
    );
  } else if (budget < 100000) {
    recommendations.restaurants = daejeonLocalData.restaurants.filter(r => 
      !r.priceRange.includes('₩40,000')
    );
  } else {
    recommendations.restaurants = daejeonLocalData.restaurants;
  }

  // Interest-based attraction recommendations
  if (interests.includes('Nature/Scenery')) {
    recommendations.attractions.push(...daejeonLocalData.attractions.filter(a => 
      a.category.includes('Nature')
    ));
  }
  
  if (interests.includes('Culture/History')) {
    recommendations.attractions.push(...daejeonLocalData.attractions.filter(a => 
      a.category.includes('Traditional') || a.category.includes('Shopping')
    ));
  }

  if (interests.includes('Hot Springs/Healing')) {
    recommendations.attractions.push(...daejeonLocalData.attractions.filter(a => 
      a.category.includes('Hot Springs') || a.category.includes('Healing')
    ));
  }

  // Default recommendations if none match
  if (recommendations.attractions.length === 0) {
    recommendations.attractions = daejeonLocalData.attractions.slice(0, 3);
  }

  return recommendations;
};