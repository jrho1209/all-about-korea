import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { start, end } = await request.json();
    
    if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid start or end coordinates' 
      }, { status: 400 });
    }

    console.log(`Direction request: ${start.lat},${start.lng} -> ${end.lat},${end.lng}`);

    // 네이버 Direction API 호출
    const naverClientId = process.env.NAVER_MAP_CLIENT_ID;
    const naverClientSecret = process.env.NAVER_MAP_CLIENT_SECRET;
    
    if (!naverClientId || !naverClientSecret) {
      console.log('Naver API credentials not found, returning error');
      return NextResponse.json({
        success: false,
        error: 'API credentials not configured'
      });
    }

    const directionUrl = new URL('https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving');
    directionUrl.searchParams.append('start', `${start.lng},${start.lat}`);
    directionUrl.searchParams.append('goal', `${end.lng},${end.lat}`);
    directionUrl.searchParams.append('option', 'trafast'); // 실시간 빠른길

    const response = await fetch(directionUrl.toString(), {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': naverClientId,
        'X-NCP-APIGW-API-KEY': naverClientSecret,
      },
    });

    if (!response.ok) {
      console.log(`Naver Direction API error: ${response.status}`);
      return NextResponse.json({
        success: false,
        error: `Direction API error: ${response.status}`
      });
    }

    const data = await response.json();
    
    if (data.code === 0 && data.route && data.route.trafast && data.route.trafast.length > 0) {
      const routeData = data.route.trafast[0];
      const path = routeData.path;
      
      // 경로 포인트들을 lat, lng 형태로 변환 (path는 [경도, 위도] 배열)
      const routePoints = path.map(point => ({
        lat: point[1], // 위도
        lng: point[0]  // 경도
      }));
      
      console.log(`Direction successful: ${routePoints.length} points, ${Math.round(routeData.summary.distance / 1000 * 10) / 10}km, ${Math.round(routeData.summary.duration / 60000)}min`);
      
      return NextResponse.json({
        success: true,
        route: routePoints,
        summary: {
          distance: routeData.summary.distance, // 미터 단위
          duration: routeData.summary.duration, // 밀리초 단위
          tollFare: routeData.summary.tollFare || 0,
          taxiFare: routeData.summary.taxiFare || 0,
          fuelPrice: routeData.summary.fuelPrice || 0
        }
      });
    } else {
      console.log(`No route found: code=${data.code}, message=${data.message || 'Unknown error'}`);
      return NextResponse.json({
        success: false,
        error: `No route found (code: ${data.code})`
      });
    }

  } catch (error) {
    console.error('Direction API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}