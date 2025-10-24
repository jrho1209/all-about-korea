'use client';

import { useEffect, useRef, useState } from 'react';

export default function TravelMap({ itinerary, onMarkerClick }) {
  const mapRef = useRef(null);
  const naverMapRef = useRef(null);
  const markersRef = useRef([]);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    initializeNaverMap();
  }, []);

  useEffect(() => {
    if (naverMapRef.current && itinerary) {
      updateMapWithItinerary();
    }
  }, [itinerary]);

  const initializeNaverMap = () => {
    // 이미 네이버 지도 API가 로드되어 있는지 확인
    if (window.naver && window.naver.maps) {
      createMap();
      return;
    }

    // 네이버 지도 API 스크립트 로드
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    
    script.onload = () => {
      console.log('Naver Maps API loaded successfully');
      // 약간의 지연을 두고 지도 생성
      setTimeout(createMap, 100);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Naver Maps API script');
      console.error('Error details:', error);
      console.error('Script URL:', script.src);
      console.error('Please check:');
      console.error('1. Internet connection');
      console.error('2. Domain registration in NCP console');
      console.error('3. Client ID validity');
    };
    
    document.head.appendChild(script);
  };

  const createMap = () => {
    if (!mapRef.current) {
      console.error('Map container not found');
      return;
    }

    if (!window.naver || !window.naver.maps) {
      console.error('Naver Maps API not loaded');
      return;
    }

    try {
      console.log('Creating Naver Map...');
      
      const mapOptions = {
        center: new naver.maps.LatLng(36.3504, 127.3845), // 대전 중심
        zoom: 12,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: naver.maps.MapTypeControlStyle.BUTTON,
          position: naver.maps.Position.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_LEFT
        }
      };

      naverMapRef.current = new naver.maps.Map(mapRef.current, mapOptions);
      console.log('Naver Map created successfully');

      // 지도 클릭 시 모든 정보창 닫기
      naver.maps.Event.addListener(naverMapRef.current, 'click', () => {
        markersRef.current.forEach(marker => {
          if (marker.infoWindow) {
            marker.infoWindow.close();
          }
        });
      });

      if (itinerary) {
        updateMapWithItinerary();
      }
    } catch (error) {
      console.error('Error creating Naver Map:', error);
    }
  };  const updateMapWithItinerary = async () => {
    if (!naverMapRef.current || !itinerary) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new naver.maps.LatLngBounds();
    const dayColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

    for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
      const day = itinerary[dayIndex];
      const dayColor = dayColors[dayIndex % dayColors.length];

      for (let actIndex = 0; actIndex < day.activities.length; actIndex++) {
        const activity = day.activities[actIndex];
        
        try {
          // 주소를 좌표로 변환
          const coords = await geocodeAddress(activity.address || activity.place);
          
          if (coords) {
            // 마커 생성
            const marker = new naver.maps.Marker({
              position: coords,
              map: naverMapRef.current,
              title: activity.place,
              icon: {
                content: `
                  <div style="
                    background: ${dayColor};
                    color: white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 12px;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  ">
                    ${actIndex + 1}
                  </div>
                `,
                anchor: new naver.maps.Point(15, 15)
              }
            });

            // 정보창 생성
            const infoWindow = new naver.maps.InfoWindow({
              content: `
                <div style="padding: 10px; min-width: 200px;">
                  <h4 style="margin: 0 0 5px 0; color: ${dayColor};">
                    Day ${day.day} - ${activity.time}
                  </h4>
                  <h5 style="margin: 0 0 5px 0; font-weight: bold;">
                    ${activity.place}
                  </h5>
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    ${activity.description}
                  </p>
                  ${activity.address ? `<p style="margin: 5px 0 0 0; font-size: 11px; color: #999;">${activity.address}</p>` : ''}
                </div>
              `
            });

            // 마커 클릭 이벤트
            naver.maps.Event.addListener(marker, 'click', () => {
              // 다른 정보창 닫기
              markersRef.current.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
              });
              infoWindow.open(naverMapRef.current, marker);
              
              if (onMarkerClick) {
                onMarkerClick(activity, dayIndex, actIndex);
              }
            });

            marker.infoWindow = infoWindow;
            markersRef.current.push(marker);
            bounds.extend(coords);
          }
        } catch (error) {
          console.error(`Geocoding failed for ${activity.place}:`, error);
        }
      }
    }

    // 지도 범위 조정
    if (markersRef.current.length > 0) {
      naverMapRef.current.fitBounds(bounds);
    }

    // 경로 그리기
    drawRoute();
  };

  const geocodeAddress = async (address) => {
    if (!address) return null;

    try {
      // Naver Geocoding API 호출
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data.lat && data.lng) {
        return new naver.maps.LatLng(data.lat, data.lng);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    return null;
  };

  const drawRoute = async () => {
    if (!naverMapRef.current || markersRef.current.length < 2) return;

    // 경로 정보 초기화
    let totalDistance = 0;
    let totalDuration = 0;
    let totalTollFare = 0;
    let totalFuelPrice = 0;
    const routeSegments = [];

    // 일자별로 실제 경로 그리기
    let markerIndex = 0;
    const dayColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

    for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
      const day = itinerary[dayIndex];
      const dayColor = dayColors[dayIndex % dayColors.length];
      const dayMarkers = markersRef.current.slice(markerIndex, markerIndex + day.activities.length);
      
      if (dayMarkers.length > 1) {
        // 하루 일정 내에서 순차적으로 경로 그리기
        for (let i = 0; i < dayMarkers.length - 1; i++) {
          const startPos = dayMarkers[i].getPosition();
          const endPos = dayMarkers[i + 1].getPosition();
          
          try {
            // 네이버 Direction API 호출
            const routeData = await getDirections(startPos, endPos);
            
            if (routeData && routeData.route && routeData.route.length > 0) {
              // 실제 경로로 폴리라인 그리기
              new naver.maps.Polyline({
                map: naverMapRef.current,
                path: routeData.route,
                strokeColor: dayColor,
                strokeWeight: 4,
                strokeOpacity: 0.8,
                strokeStyle: 'solid'
              });

              // 경로 정보 누적
              if (routeData.summary) {
                totalDistance += routeData.summary.distance || 0;
                totalDuration += routeData.summary.duration || 0;
                totalTollFare += routeData.summary.tollFare || 0;
                totalFuelPrice += routeData.summary.fuelPrice || 0;
                
                routeSegments.push({
                  from: day.activities[i].place,
                  to: day.activities[i + 1].place,
                  distance: routeData.summary.distance,
                  duration: routeData.summary.duration,
                  tollFare: routeData.summary.tollFare || 0,
                  fuelPrice: routeData.summary.fuelPrice || 0,
                  day: dayIndex + 1
                });
              }
            } else {
              // Direction API 실패 시 직선으로 연결
              new naver.maps.Polyline({
                map: naverMapRef.current,
                path: [startPos, endPos],
                strokeColor: dayColor,
                strokeWeight: 3,
                strokeOpacity: 0.6,
                strokeStyle: 'dashed'
              });
            }
          } catch (error) {
            console.error('Direction API error:', error);
            // 오류 시 직선으로 연결
            new naver.maps.Polyline({
              map: naverMapRef.current,
              path: [startPos, endPos],
              strokeColor: dayColor,
              strokeWeight: 3,
              strokeOpacity: 0.6,
              strokeStyle: 'dashed'
            });
          }
        }
      }
      
      markerIndex += day.activities.length;
    }

    // 경로 정보 업데이트
    if (routeSegments.length > 0) {
      setRouteInfo({
        totalDistance,
        totalDuration,
        totalTollFare,
        totalFuelPrice,
        segments: routeSegments
      });
    }
  };

  // 네이버 Direction API 호출 함수
  const getDirections = async (start, end) => {
    try {
      const response = await fetch('/api/directions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: { lat: start.lat(), lng: start.lng() },
          end: { lat: end.lat(), lng: end.lng() }
        })
      });

      if (!response.ok) {
        throw new Error('Direction API response not ok');
      }

      const data = await response.json();
      
      if (data.success && data.route) {
        // 경로 포인트들을 LatLng 객체로 변환
        const routePoints = data.route.map(point => new naver.maps.LatLng(point.lat, point.lng));
        return {
          route: routePoints,
          summary: data.summary
        };
      }
      
      return null;
    } catch (error) {
      console.error('Direction API call failed:', error);
      return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📍 Travel Route Map</h3>
        <p className="text-sm text-gray-600">
          Click on markers to see detailed information. Different colors represent different days.
        </p>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-300 shadow-lg"
        style={{ minHeight: '400px' }}
      />
      
      <div className="mt-3 flex flex-wrap gap-2">
        {itinerary?.map((day, index) => {
          const dayColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
          const color = dayColors[index % dayColors.length];
          return (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm"
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>Day {day.day} ({day.activities.length} stops)</span>
            </div>
          );
        })}
      </div>

      {/* 경로 정보 표시 */}
      {routeInfo && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-md font-semibold text-blue-800 mb-3">🚗 Route Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {(routeInfo.totalDistance / 1000).toFixed(1)}km
              </div>
              <div className="text-gray-600">Total Distance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {Math.round(routeInfo.totalDuration / 60000)}min
              </div>
              <div className="text-gray-600">Driving Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                ₩{routeInfo.totalTollFare.toLocaleString()}
              </div>
              <div className="text-gray-600">Toll Fee</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                ₩{routeInfo.totalFuelPrice.toLocaleString()}
              </div>
              <div className="text-gray-600">Fuel Cost</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {routeInfo.segments.length}
              </div>
              <div className="text-gray-600">Route Segments</div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <p>• Solid lines: Real driving routes with real-time traffic</p>
            <p>• Dashed lines: Direct connections (route not available)</p>
            <p>• Costs calculated based on current fuel prices and traffic conditions</p>
          </div>
        </div>
      )}
    </div>
  );
}