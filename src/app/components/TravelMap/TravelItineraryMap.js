'use client';

import { useRef, useEffect, useState } from 'react';

export default function TravelItineraryMap({ itinerary }) {
  const mapRef = useRef(null);
  const [status, setStatus] = useState('지도 초기화 중...');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  // 지오코딩 함수
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data.lat && data.lng) {
        return new window.naver.maps.LatLng(data.lat, data.lng);
      } else {
        // 기본 대전 좌표 반환
        return new window.naver.maps.LatLng(36.3504, 127.3845);
      }
    } catch (error) {
      console.error('지오코딩 오류:', error);
      return new window.naver.maps.LatLng(36.3504, 127.3845);
    }
  };

  // 여행 일정 표시 함수
  const displayItinerary = async (map) => {
    try {
      setStatus('여행 일정 표시 중...');

      const bounds = new window.naver.maps.LatLngBounds();
      const dayColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
      const newMarkers = [];

      for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
        const day = itinerary[dayIndex];
        const dayColor = dayColors[dayIndex % dayColors.length];

        for (let actIndex = 0; actIndex < day.activities.length; actIndex++) {
          const activity = day.activities[actIndex];
          
          // 주소를 좌표로 변환
          const coords = await geocodeAddress(activity.address || activity.place);
          
          if (coords) {
            // 마커 생성
            const marker = new window.naver.maps.Marker({
              position: coords,
              map: map,
              title: activity.place,
              icon: {
                content: `
                  <div style="
                    background: ${dayColor};
                    color: white;
                    padding: 5px 8px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    min-width: 25px;
                    text-align: center;
                    font-family: Arial, sans-serif;
                  ">
                    ${dayIndex + 1}-${actIndex + 1}
                  </div>
                `,
                size: new window.naver.maps.Size(35, 25),
                anchor: new window.naver.maps.Point(17, 12)
              }
            });

            // 정보창 생성
            const infoWindow = new window.naver.maps.InfoWindow({
              content: `
                <div style="
                  padding: 15px; 
                  max-width: 280px;
                  font-family: Arial, sans-serif;
                  line-height: 1.4;
                  position: relative;
                ">
                  <button onclick="
                    if (window.currentOpenInfoWindow) {
                      window.currentOpenInfoWindow.close();
                      window.currentOpenInfoWindow = null;
                    }
                  " style="
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: #f5f5f5;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    transition: background-color 0.2s;
                  " onmouseover="this.style.backgroundColor='#e0e0e0'" 
                     onmouseout="this.style.backgroundColor='#f5f5f5'">
                    ✕
                  </button>
                  <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                  ">
                    <div style="
                      background: ${dayColor};
                      color: white;
                      padding: 4px 8px;
                      border-radius: 12px;
                      font-size: 11px;
                      font-weight: bold;
                      margin-right: 8px;
                    ">
                      Day ${dayIndex + 1}
                    </div>
                    <span style="font-size: 12px; color: #666;">
                      ${activity.time || '시간 미정'}
                    </span>
                  </div>
                  <h4 style="
                    margin: 0 0 5px 0; 
                    color: #333;
                    font-size: 16px;
                    font-weight: bold;
                    padding-right: 20px;
                  ">
                    ${activity.place}
                  </h4>
                  <div style="
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 8px;
                  ">
                    📍 ${activity.address || '주소 정보 없음'}
                  </div>
                  ${activity.description ? `
                    <p style="
                      margin: 0;
                      font-size: 13px;
                      color: #555;
                      line-height: 1.3;
                    ">
                      ${activity.description}
                    </p>
                  ` : ''}
                </div>
              `
            });

            // 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
              // 기존에 열린 정보창이 있으면 닫기
              if (window.currentOpenInfoWindow) {
                window.currentOpenInfoWindow.close();
              }
              
              // 새 정보창 열기
              infoWindow.open(map, marker);
              
              // 현재 열린 정보창 추적
              window.currentOpenInfoWindow = infoWindow;
            });

            newMarkers.push({ marker, infoWindow });
            bounds.extend(coords);
          }
        }
      }

      setMarkers(newMarkers);

      // 모든 마커가 보이도록 지도 범위 조정
      if (newMarkers.length > 0) {
        map.fitBounds(bounds, { padding: 50 });
      }

      // 경로 그리기
      console.log('DisplayItinerary: 경로 그리기 시작, 마커 수:', newMarkers.length);
      if (newMarkers.length > 1) {
        try {
          await drawRoutes(map, newMarkers);
          console.log('DisplayItinerary: 경로 그리기 완료');
        } catch (routeError) {
          console.error('DisplayItinerary: 경로 그리기 오류:', routeError);
        }
      } else {
        console.log('DisplayItinerary: 마커가 부족하여 경로 그리기 생략');
      }

    } catch (error) {
      console.error('여행 일정 표시 오류:', error);
      setStatus(`❌ 일정 표시 실패: ${error.message}`);
    }
  };

  // 경로 그리기 함수
  const drawRoutes = async (map, markers) => {
    if (!map || markers.length < 2) {
      console.log('DrawRoutes: 조건 불충족 - map:', !!map, 'markers length:', markers.length);
      return;
    }

    console.log('DrawRoutes: 경로 그리기 시작, 마커 수:', markers.length);
    console.log('DrawRoutes: 여행일정 일수:', itinerary?.length);

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
      const dayMarkers = markers.slice(markerIndex, markerIndex + day.activities.length);
      
      console.log(`Day ${dayIndex + 1}: ${day.activities.length}개 활동, ${dayMarkers.length}개 마커`);
      
      if (dayMarkers.length > 1) {
        // 하루 일정 내에서 순차적으로 경로 그리기
        for (let i = 0; i < dayMarkers.length - 1; i++) {
          const startMarker = dayMarkers[i].marker;
          const endMarker = dayMarkers[i + 1].marker;
          const startPos = startMarker.getPosition();
          const endPos = endMarker.getPosition();
          
          console.log(`경로 ${i + 1}: ${day.activities[i].place} -> ${day.activities[i + 1].place}`);
          
          try {
            // 네이버 Direction API 호출
            const routeData = await getDirections(startPos, endPos);
            
            if (routeData && routeData.route && routeData.route.length > 0) {
              console.log('경로 찾기 성공:', routeData.route.length, '포인트');
              
              // 폴리라인 생성 전 윈도우 객체 확인
              if (window.naver && window.naver.maps && window.naver.maps.Polyline) {
                try {
                  const polyline = new window.naver.maps.Polyline({
                    map: map,
                    path: routeData.route,
                    strokeColor: dayColor,
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                    strokeStyle: 'solid'
                  });
                  
                  console.log('폴리라인 생성 성공');
                } catch (polylineError) {
                  console.error('폴리라인 생성 오류:', polylineError);
                  // 폴리라인 생성 실패 시 직선으로 대체
                  new window.naver.maps.Polyline({
                    map: map,
                    path: [startPos, endPos],
                    strokeColor: dayColor,
                    strokeWeight: 3,
                    strokeOpacity: 0.6,
                    strokeStyle: 'dashed'
                  });
                }
              } else {
                console.error('Naver Maps Polyline 클래스를 찾을 수 없음');
              }

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
              console.log('경로 찾기 실패, 직선으로 연결');
              // Direction API 실패 시 직선으로 연결
              new window.naver.maps.Polyline({
                map: map,
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
            new window.naver.maps.Polyline({
              map: map,
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
      console.log('경로 정보 업데이트:', routeSegments.length, '개 구간');
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
      console.log('GetDirections: API 호출 시작');
      console.log('Start:', start.lat(), start.lng());
      console.log('End:', end.lat(), end.lng());
      
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

      console.log('GetDirections: Response status:', response.status);

      if (!response.ok) {
        console.error('GetDirections: Response not ok:', response.status, response.statusText);
        throw new Error(`Direction API response not ok: ${response.status}`);
      }

      const data = await response.json();
      console.log('GetDirections: Response data:', data);
      
      if (data.success && data.route) {
        console.log('GetDirections: 성공, 경로 포인트 수:', data.route.length);
        // 경로 포인트들을 LatLng 객체로 변환
        const routePoints = data.route.map(point => new window.naver.maps.LatLng(point.lat, point.lng));
        return {
          route: routePoints,
          summary: data.summary
        };
      } else {
        console.error('GetDirections: API 응답에서 경로 데이터 없음:', data);
        return null;
      }
      
    } catch (error) {
      console.error('GetDirections: 오류 발생:', error);
      return null;
    }
  };

  useEffect(() => {
    let script = null;

    const loadNaverMap = async () => {
      try {
        // 이미 로드된 경우
        if (window.naver && window.naver.maps) {
          console.log('네이버 지도 API 이미 로드됨');
          initMap();
          return;
        }

        setStatus('네이버 지도 API 로딩 중...');

        const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
        if (!clientId) {
          throw new Error('네이버 지도 Client ID가 설정되지 않았습니다');
        }

        // 인증 실패 핸들러
        window.navermap_authFailure = function() {
          console.error('네이버 지도 API 인증 실패');
          setStatus('❌ API 인증 실패');
        };

        // 스크립트 동적 로딩
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
        script.charset = 'utf-8';

        const scriptPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        document.head.appendChild(script);
        await scriptPromise;

        setTimeout(() => {
          if (window.naver && window.naver.maps) {
            initMap();
          } else {
            throw new Error('네이버 지도 API 로드 실패');
          }
        }, 100);

      } catch (error) {
        console.error('네이버 지도 로딩 오류:', error);
        setStatus(`❌ 로딩 실패: ${error.message}`);
      }
    };

    const initMap = async () => {
      try {
        if (!mapRef.current) {
          throw new Error('지도 컨테이너를 찾을 수 없습니다');
        }

        setStatus('지도 생성 중...');

        const mapOptions = {
          center: new window.naver.maps.LatLng(36.3504, 127.3845),
          zoom: 13,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.naver.maps.MapTypeControlStyle.BUTTON,
            position: window.naver.maps.Position.TOP_RIGHT
          },
          zoomControl: true,
          zoomControlOptions: {
            style: window.naver.maps.ZoomControlStyle.SMALL,
            position: window.naver.maps.Position.TOP_LEFT
          },
          scaleControl: false,
          logoControl: true,
          mapDataControl: true,
          minZoom: 7,
          maxZoom: 21
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        
        // 지도 클릭 시 모든 정보창 닫기
        window.naver.maps.Event.addListener(map, 'click', () => {
          // 모든 열린 정보창 닫기
          if (window.currentOpenInfoWindow) {
            window.currentOpenInfoWindow.close();
            window.currentOpenInfoWindow = null;
          }
        });
        
        setMapLoaded(true);
        setStatus('✅ 지도 로드 완료');

        // 여행 일정이 있으면 마커 표시
        if (itinerary && itinerary.length > 0) {
          await displayItinerary(map);
        }

      } catch (error) {
        console.error('지도 초기화 오류:', error);
        setStatus(`❌ 초기화 실패: ${error.message}`);
      }
    };

    loadNaverMap();

    // 클린업
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.navermap_authFailure) {
        delete window.navermap_authFailure;
      }
      if (window.currentOpenInfoWindow) {
        window.currentOpenInfoWindow.close();
        delete window.currentOpenInfoWindow;
      }
    };
  }, []);

  // 여행 일정이 변경될 때 지도 업데이트
  useEffect(() => {
    if (mapLoaded && window.naver && window.naver.maps && mapRef.current) {
      const map = new window.naver.maps.Map(mapRef.current);
      if (itinerary && itinerary.length > 0) {
        // 기존 마커 제거
        markers.forEach(({ marker, infoWindow }) => {
          if (infoWindow && infoWindow.getMap()) {
            infoWindow.close();
          }
          marker.setMap(null);
        });
        
        // 새 마커 표시
        displayItinerary(map);
      }
    }
  }, [itinerary, mapLoaded]);

  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      border: '1px solid #ddd', 
      borderRadius: '12px',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa'
    }}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* 상태 표시 */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        background: 'rgba(255,255,255,0.95)',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        maxWidth: '320px',
        backdropFilter: 'blur(4px)'
      }}>
        {status}
      </div>

      {/* 범례 */}
      {mapLoaded && itinerary && itinerary.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          background: 'rgba(255,255,255,0.95)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            📍 여행 일정
          </div>
          {itinerary.map((day, index) => {
            const dayColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: dayColors[index % dayColors.length],
                  borderRadius: '50%',
                  marginRight: '6px'
                }}></div>
                <span>Day {index + 1} ({day.activities.length}개 장소)</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 경로 정보 표시 */}
      {routeInfo && (
        <div style={{
          margin: '20px 0',
          padding: '20px',
          background: '#f8f9ff',
          borderRadius: '12px',
          border: '1px solid #e3e8ff'
        }}>
          <h4 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#1e40af', 
            marginBottom: '15px' 
          }}>
            🚗 여행 경로 요약
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            fontSize: '14px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#2563eb' 
              }}>
                {(routeInfo.totalDistance / 1000).toFixed(1)}km
              </div>
              <div style={{ color: '#6b7280' }}>총 거리</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#059669' 
              }}>
                {Math.round(routeInfo.totalDuration / 60000)}분
              </div>
              <div style={{ color: '#6b7280' }}>소요 시간</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#ea580c' 
              }}>
                ₩{routeInfo.totalTollFare.toLocaleString()}
              </div>
              <div style={{ color: '#6b7280' }}>통행료</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#dc2626' 
              }}>
                ₩{routeInfo.totalFuelPrice.toLocaleString()}
              </div>
              <div style={{ color: '#6b7280' }}>연료비</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#7c3aed' 
              }}>
                {routeInfo.segments.length}
              </div>
              <div style={{ color: '#6b7280' }}>경로 구간</div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '15px', 
            fontSize: '12px', 
            color: '#6b7280' 
          }}>
            <p style={{ margin: '2px 0' }}>• 실선: 실제 도로 경로 (실시간 교통정보 반영)</p>
            <p style={{ margin: '2px 0' }}>• 점선: 직선 연결 (경로 정보 없음)</p>
            <p style={{ margin: '2px 0' }}>• 비용은 현재 유류비와 교통 상황을 반영한 예상 금액입니다</p>
          </div>
        </div>
      )}

      {/* 로딩 오버레이 */}
      {!mapLoaded && !status.includes('❌') && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(248, 249, 250, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            padding: '30px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f1f3f4',
              borderTop: '3px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px'
            }}></div>
            <div style={{ fontSize: '16px', color: '#5f6368' }}>
              지도를 불러오는 중...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}