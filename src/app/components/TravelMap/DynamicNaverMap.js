'use client';

import { useRef, useEffect, useState } from 'react';

export default function DynamicNaverMap() {
  const mapRef = useRef(null);
  const [status, setStatus] = useState('초기화 중...');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let script = null;

    const loadNaverMap = async () => {
      try {
        // 이미 로드된 경우 확인
        if (window.naver && window.naver.maps) {
          console.log('네이버 지도 API 이미 로드됨');
          initMap();
          return;
        }

        console.log('네이버 지도 스크립트 로딩 시작...');
        setStatus('스크립트 로딩 중...');

        const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
        if (!clientId) {
          throw new Error('네이버 지도 Client ID가 설정되지 않았습니다');
        }

        // 인증 실패 핸들러 설정
        window.navermap_authFailure = function() {
          console.error('네이버 지도 API 인증 실패');
          setStatus('❌ API 인증 실패');
        };

        // 동적으로 스크립트 태그 생성
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
        script.charset = 'utf-8';

        // Promise로 스크립트 로딩 처리
        const scriptPromise = new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('네이버 지도 스크립트 로드 완료');
            resolve();
          };
          script.onerror = (error) => {
            console.error('스크립트 로드 실패:', error);
            reject(new Error('스크립트 로드 실패'));
          };
        });

        // 헤드에 스크립트 추가
        document.head.appendChild(script);

        // 스크립트 로딩 완료 대기
        await scriptPromise;

        // 약간의 지연 후 지도 초기화
        setTimeout(() => {
          if (window.naver && window.naver.maps) {
            initMap();
          } else {
            throw new Error('네이버 지도 API 로드 후에도 접근할 수 없습니다');
          }
        }, 100);

      } catch (error) {
        console.error('네이버 지도 로딩 오류:', error);
        setStatus(`❌ 로딩 실패: ${error.message}`);
      }
    };

    const initMap = () => {
      try {
        if (!mapRef.current) {
          throw new Error('지도 컨테이너를 찾을 수 없습니다');
        }

        setStatus('지도 생성 중...');

        const mapOptions = {
          center: new window.naver.maps.LatLng(36.3504, 127.3845),
          zoom: 13,
          mapTypeControl: true,
          zoomControl: true,
          scaleControl: false,
          logoControl: true,
          mapDataControl: true
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        
        // 대전 주요 관광지 마커들
        const locations = [
          {
            position: new window.naver.maps.LatLng(36.3278, 127.4267),
            title: '성심당',
            content: '<div style="padding:10px;"><h4>성심당</h4><p>대전 대표 베이커리</p></div>'
          },
          {
            position: new window.naver.maps.LatLng(36.3667, 127.3956),
            title: '한밭수목원',
            content: '<div style="padding:10px;"><h4>한밭수목원</h4><p>도심 속 자연공간</p></div>'
          },
          {
            position: new window.naver.maps.LatLng(36.3622, 127.3333),
            title: '유성온천',
            content: '<div style="padding:10px;"><h4>유성온천</h4><p>전통 온천지역</p></div>'
          }
        ];

        locations.forEach((location, index) => {
          const marker = new window.naver.maps.Marker({
            position: location.position,
            map: map,
            title: location.title,
            icon: {
              content: `<div style="background:#ff6b6b;color:white;padding:5px 8px;border-radius:15px;font-size:12px;font-weight:bold;">${index + 1}</div>`,
              size: new window.naver.maps.Size(30, 30),
              anchor: new window.naver.maps.Point(15, 15)
            }
          });

          const infoWindow = new window.naver.maps.InfoWindow({
            content: location.content
          });

          window.naver.maps.Event.addListener(marker, 'click', () => {
            if (infoWindow.getMap()) {
              infoWindow.close();
            } else {
              infoWindow.open(map, marker);
            }
          });
        });

        setMapLoaded(true);
        setStatus('✅ 지도 로드 완료');
        console.log('지도 초기화 완료');

      } catch (error) {
        console.error('지도 초기화 오류:', error);
        setStatus(`❌ 초기화 실패: ${error.message}`);
      }
    };

    loadNaverMap();

    // 클린업 함수
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.navermap_authFailure) {
        delete window.navermap_authFailure;
      }
    };
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* 상태 표시 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(255,255,255,0.95)',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '300px'
      }}>
        {status}
      </div>

      {/* 로딩 오버레이 */}
      {!mapLoaded && !status.includes('❌') && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            지도를 불러오는 중...
          </div>
        </div>
      )}
    </div>
  );
}