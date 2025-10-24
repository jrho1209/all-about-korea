import { NextResponse } from 'next/server';

// 네이버 지오코딩 API를 위한 확장된 fallback 좌표 데이터
const fallbackCoordinates = {
  // 정확한 주소 매칭
  "15, Daejong-ro 480beon-gil, Jung-gu, Daejeon": { lat: 36.3218, lng: 127.4187 },
  "대전광역시 중구 대종로480번길 15": { lat: 36.3218, lng: 127.4187 },
  "성심당 본점": { lat: 36.3218, lng: 127.4187 },
  
  "169, Dunsan-daero, Seo-gu, Daejeon": { lat: 36.3668, lng: 127.3845 },
  "대전광역시 서구 둔산대로 169": { lat: 36.3668, lng: 127.3845 },
  "한밭수목원": { lat: 36.3668, lng: 127.3845 },
  
  "246, Bomun-ro, Jung-gu, Daejeon": { lat: 36.3285, lng: 127.4031 },
  "대전광역시 중구 보문로 246": { lat: 36.3285, lng: 127.4031 },
  "왕관식당": { lat: 36.3285, lng: 127.4031 },
  
  "488, Daejong-ro, Jung-gu, Daejeon": { lat: 36.3288, lng: 127.4206 },
  "대전광역시 중구 대종로 488": { lat: 36.3288, lng: 127.4206 },
  "대전중앙시장": { lat: 36.3288, lng: 127.4206 },
  
  "123-45, Wolpyeong-dong, Seo-gu, Daejeon": { lat: 36.3521, lng: 127.3456 },
  "대전광역시 서구 월평동 123-45": { lat: 36.3521, lng: 127.3456 },
  "칼국수전문점": { lat: 36.3521, lng: 127.3456 },
  
  "Chu-dong, Dong-gu, Daejeon": { lat: 36.3776, lng: 127.4783 },
  "대전광역시 동구 추동": { lat: 36.3776, lng: 127.4783 },
  "대청호 오백리길": { lat: 36.3776, lng: 127.4783 },
  
  "Jang-dong, Daedeok-gu, Daejeon": { lat: 36.3459, lng: 127.4128 },
  "대전광역시 대덕구 장동": { lat: 36.3459, lng: 127.4128 },
  "계족산 황토길": { lat: 36.3459, lng: 127.4128 },
  
  // 온천 관련 주소
  "대전광역시 유성구 온천로": { lat: 36.3506, lng: 127.3447 },
  "Yuseong Hot Springs": { lat: 36.3506, lng: 127.3447 },
  "유성온천": { lat: 36.3506, lng: 127.3447 },
  
  "대전광역시 유성구 대덕대로 480": { lat: 36.3687, lng: 127.3434 },
  "480, Daedeok-daero, Yuseong-gu, Daejeon": { lat: 36.3687, lng: 127.3434 },
  
  // 구별 중심 좌표 (일반적인 fallback)
  "중구": { lat: 36.3285, lng: 127.4095 },
  "Jung-gu": { lat: 36.3285, lng: 127.4095 },
  "서구": { lat: 36.3555, lng: 127.3845 },
  "Seo-gu": { lat: 36.3555, lng: 127.3845 },
  "동구": { lat: 36.3501, lng: 127.4543 },
  "Dong-gu": { lat: 36.3501, lng: 127.4543 },
  "유성구": { lat: 36.3620, lng: 127.3564 },
  "Yuseong-gu": { lat: 36.3620, lng: 127.3564 },
  "대덕구": { lat: 36.3459, lng: 127.4128 },
  "Daedeok-gu": { lat: 36.3459, lng: 127.4128 },
  
  // 대전 일반 좌표
  "대전": { lat: 36.3504, lng: 127.3845 },
  "Daejeon": { lat: 36.3504, lng: 127.3845 },
  "대전광역시": { lat: 36.3504, lng: 127.3845 }
};

// 주소 정규화 함수
function normalizeAddress(address) {
  return address
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/대전광역시\s*/g, '')
    .replace(/daejeon\s*/g, '')
    .trim();
}

// Fallback 좌표 검색 함수 (한국어 우선)
function findFallbackCoordinates(address) {
  // 1. 정확한 주소 매칭 (한국어 먼저)
  if (fallbackCoordinates[address]) {
    console.log(`Found exact fallback coordinates for "${address}"`);
    return fallbackCoordinates[address];
  }
  
  // 2. 정규화된 주소로 검색
  const normalized = normalizeAddress(address);
  for (const [key, coords] of Object.entries(fallbackCoordinates)) {
    if (normalizeAddress(key) === normalized) {
      console.log(`Found normalized fallback coordinates for "${address}" -> "${key}"`);
      return coords;
    }
  }
  
  // 3. 부분 매칭 (한국어 키워드 우선)
  const koreanKeywords = ['성심당', '한밭수목원', '왕관식당', '중앙시장', '칼국수', '대청호', '계족산', '유성온천'];
  for (const keyword of koreanKeywords) {
    if (address.includes(keyword)) {
      for (const [key, coords] of Object.entries(fallbackCoordinates)) {
        if (key.includes(keyword)) {
          console.log(`Found Korean keyword fallback coordinates for "${address}" -> "${key}"`);
          return coords;
        }
      }
    }
  }
  
  // 4. 구별 매칭
  const districts = ['중구', '서구', '동구', '유성구', '대덕구', 'Jung-gu', 'Seo-gu', 'Dong-gu', 'Yuseong-gu', 'Daedeok-gu'];
  for (const district of districts) {
    if (address.includes(district) && fallbackCoordinates[district]) {
      console.log(`Found district fallback coordinates for "${address}" -> "${district}"`);
      return fallbackCoordinates[district];
    }
  }
  
  // 5. 대전 기본 좌표
  console.log(`Using default Daejeon coordinates for: ${address}`);
  return fallbackCoordinates["대전"];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const koreanAddress = searchParams.get('koreanAddress'); // 한국어 주소 우선 파라미터
  
  if (!address && !koreanAddress) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  // 한국어 주소가 있으면 우선 사용, 없으면 일반 주소 사용
  const targetAddress = koreanAddress || address;
  console.log(`Geocoding request for address: ${targetAddress}`);

  try {
    // 네이버 지오코딩 API 호출 (한국어 우선)
    const naverClientId = process.env.NAVER_CLIENT_ID;
    const naverClientSecret = process.env.NAVER_CLIENT_SECRET;
    
    if (!naverClientId || !naverClientSecret) {
      console.log('Naver API credentials not found, using fallback coordinates');
      const coords = findFallbackCoordinates(targetAddress);
      console.log(`Using fallback coordinates for: ${targetAddress}`);
      return NextResponse.json(coords);
    }

    // 한국어 주소일 경우 한국어 우선 검색
    const geocodeUrl = new URL('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode');
    geocodeUrl.searchParams.append('query', targetAddress);
    
    // 한국어 주소인 경우 언어 설정
    if (koreanAddress || /[가-힣]/.test(targetAddress)) {
      geocodeUrl.searchParams.append('language', 'korean');
      geocodeUrl.searchParams.append('coordinate', '127.3845,36.3504'); // 대전 중심 좌표
    }

    const response = await fetch(geocodeUrl.toString(), {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': naverClientId,
        'X-NCP-APIGW-API-KEY': naverClientSecret,
      },
    });

    if (!response.ok) {
      console.log(`Naver API error: ${response.status}, using fallback coordinates`);
      const coords = findFallbackCoordinates(targetAddress);
      console.log(`Using fallback coordinates for: ${targetAddress}`);
      return NextResponse.json(coords);
    }

    const data = await response.json();
    
    if (data.addresses && data.addresses.length > 0) {
      const location = data.addresses[0];
      const coordinates = {
        lat: parseFloat(location.y),
        lng: parseFloat(location.x)
      };
      
      console.log(`Naver geocoding successful for: ${targetAddress}`, coordinates);
      return NextResponse.json(coordinates);
    } else {
      console.log(`No results from Naver API for: ${targetAddress}, using fallback`);
      const coords = findFallbackCoordinates(targetAddress);
      console.log(`Using fallback coordinates for: ${targetAddress}`);
      return NextResponse.json(coords);
    }

  } catch (error) {
    console.error('Geocoding error:', error);
    const coords = findFallbackCoordinates(targetAddress);
    console.log(`Using fallback coordinates for: ${targetAddress}`);
    return NextResponse.json(coords);
  }
}