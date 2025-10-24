'use client';

import { useRef, useEffect, useState } from 'react';

export default function TravelMapNew({ itinerary }) {
  const mapElementRef = useRef(null);
  const naverMapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 지오코딩 함수
  const geocodeAddress = async (address) => {
    try {
      console.log('지오코딩 요청:', address);
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data.success && data.lat && data.lng) {
        console.log('좌표 변환 성공:', data);
        return new window.naver.maps.LatLng(data.lat, data.lng);
      } else {
        console.log('좌표 변환 실패, 기본 대전 좌표 사용');
        return new window.naver.maps.LatLng(36.3504, 127.3845);
      }
    } catch (error) {
      console.error('지오코딩 오류:', error);
      return new window.naver.maps.LatLng(36.3504, 127.3845);
    }
  };

  // 네이버 지도 스크립트 로드
  const loadNaverMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
      script.onload = () => {
        console.log('네이버 지도 스크립트 로드 완료');
        resolve();
      };
      script.onerror = (error) => {
        console.error('네이버 지도 스크립트 로드 실패:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  };

  // 지도 초기화
  const initializeMap = async () => {
    try {
      await loadNaverMapScript();

      if (!mapElementRef.current) {
        console.error('지도 컨테이너를 찾을 수 없습니다');
        return;
      }

      const mapOptions = {
        center: new window.naver.maps.LatLng(36.3504, 127.3845),
        zoom: 13,
        mapTypeControl: true,
        zoomControl: true,
        logoControl: false,
        scaleControl: false
      };

      naverMapRef.current = new window.naver.maps.Map(mapElementRef.current, mapOptions);
      setMapLoaded(true);
      
      console.log('네이버 지도 초기화 완료');

    } catch (error) {
      console.error('지도 초기화 실패:', error);
      setMapLoaded(false);
    }
  };

  // 여행 일정을 지도에 표시
  const updateMapWithItinerary = async () => {
    if (!naverMapRef.current || !itinerary) return;

    console.log('여행일정을 지도에 표시 중...', itinerary);

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const bounds = new window.naver.maps.LatLngBounds();
    const dayColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

    for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
      const day = itinerary[dayIndex];
      const dayColor = dayColors[dayIndex % dayColors.length];

      console.log(`Day ${dayIndex + 1} 처리 중:`, day);

      for (let actIndex = 0; actIndex < day.activities.length; actIndex++) {
        const activity = day.activities[actIndex];
        
        try {
          const coords = await geocodeAddress(activity.address || activity.place);
          
          if (coords) {
            // 마커 생성
            const marker = new window.naver.maps.Marker({
              position: coords,
              map: naverMapRef.current,
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
                    min-width: 20px;
                    text-align: center;
                  ">
                    ${dayIndex + 1}-${actIndex + 1}
                  </div>
                `,
                size: new window.naver.maps.Size(30, 30),
                anchor: new window.naver.maps.Point(15, 15)
              }
            });

            // 정보창 설정
            const infoWindow = new window.naver.maps.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 250px;">
                  <h4 style="margin: 0 0 5px 0; color: ${dayColor};">
                    Day ${dayIndex + 1} - ${actIndex + 1}
                  </h4>
                  <strong>${activity.place}</strong><br>
                  <small>${activity.address || '주소 정보 없음'}</small><br>
                  <small style="color: #666;">${activity.time || ''}</small>
                  ${activity.description ? `<p style="margin: 5px 0 0 0; font-size: 12px;">${activity.description}</p>` : ''}
                </div>
              `
            });

            // 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }
              infoWindow.open(naverMapRef.current, marker);
              infoWindowRef.current = infoWindow;
            });

            markersRef.current.push(marker);
            bounds.extend(coords);
          }
        } catch (error) {
          console.error(`Activity ${activity.place} 마커 생성 실패:`, error);
        }
      }
    }

    // 모든 마커가 보이도록 지도 범위 조정
    if (markersRef.current.length > 0) {
      naverMapRef.current.fitBounds(bounds, { padding: 50 });
    }

    console.log(`총 ${markersRef.current.length}개 마커 생성 완료`);
  };

  // 컴포넌트 마운트 시 지도 초기화
  useEffect(() => {
    initializeMap();
  }, []);

  // 여행일정이 변경될 때 지도 업데이트
  useEffect(() => {
    if (mapLoaded && itinerary) {
      updateMapWithItinerary();
    }
  }, [mapLoaded, itinerary]);

  return (
    <div className="travel-map-container">
      <div 
        ref={mapElementRef}
        style={{ 
          width: '100%', 
          height: '500px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}
      />
      {!mapLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.8)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          지도를 로드하는 중...
        </div>
      )}
    </div>
  );
}