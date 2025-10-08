"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { uploadTravelPhoto, uploadProfilePhoto, uploadBackgroundImage, formatFileSize } from '../../lib/cloudinary';

export default function AgencyDashboardPage() {
  const { data: session } = useSession();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [calendarDate, setCalendarDate] = useState(new Date()); // Calendar navigation state
  const [aboutMe, setAboutMe] = useState(''); // About Me content
  const [aboutMeLoading, setAboutMeLoading] = useState(false); // About Me save state
  
  // Firebase upload states
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [agencyData, setAgencyData] = useState(null);

  // Calendar setup
  const localizer = momentLocalizer(moment);
  
  // Color palette for different inquiries
  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  
  // Generate color for inquiry (consistent based on ID)
  const getInquiryColor = (inquiryId) => {
    const hash = inquiryId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colorPalette[Math.abs(hash) % colorPalette.length];
  };

  // Safe date formatting function
  const formatDate = (dateValue) => {
    if (!dateValue) return 'Unknown date';
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      // If date is invalid, try parsing as string
      const parsedDate = new Date(dateValue.toString());
      if (isNaN(parsedDate.getTime())) {
        return 'Unknown date';
      }
      return parsedDate.toLocaleDateString('ko-KR');
    }
    return date.toLocaleDateString('ko-KR');
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return 'Unknown time';
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      // If date is invalid, try parsing as string
      const parsedDate = new Date(dateValue.toString());
      if (isNaN(parsedDate.getTime())) {
        return 'Unknown time';
      }
      return `${parsedDate.toLocaleDateString('ko-KR')} at ${parsedDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${date.toLocaleDateString('ko-KR')} at ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  useEffect(() => {
    if (session?.user?.role === 'agency') {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const inquiriesRes = await fetch('/api/agency/inquiries');

      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        setInquiries(inquiriesData);
      }

      // Fetch agency profile information
      const agencyRes = await fetch('/api/agency/profile');
      if (agencyRes.ok) {
        const agencyData = await agencyRes.json();
        setAboutMe(agencyData.aboutMe || '');
        setAgencyData(agencyData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 여행 사진 업로드 함수
  const handleTravelPhotosUpload = async (files) => {
    if (!agencyData?._id) {
      alert('Agency information not loaded. Please refresh the page.');
      return;
    }

    setUploadingPhotos(true);
    const uploadedUrls = [];
    const progressArray = Array(files.length).fill(0);
    setUploadProgress(progressArray);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 진행률 업데이트
        progressArray[i] = 50;
        setUploadProgress([...progressArray]);
        
        const url = await uploadTravelPhoto(file, agencyData._id);
        uploadedUrls.push(url);
        
        // 완료 표시
        progressArray[i] = 100;
        setUploadProgress([...progressArray]);
      }

      // 기존 사진들과 새 사진들 합치기
      const currentPhotos = agencyData.travelPhotos || [];
      const updatedPhotos = [...currentPhotos, ...uploadedUrls];

      // API 업데이트
      const res = await fetch('/api/agency/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ travelPhotos: updatedPhotos }),
      });

      if (res.ok) {
        const result = await res.json();
        alert(`${files.length}개의 사진이 성공적으로 업로드되었습니다!`);
        // 데이터 새로고침
        await fetchDashboardData();
      } else {
        const errorResult = await res.json();
        alert('사진 정보 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`업로드 실패: ${error.message}`);
    } finally {
      setUploadingPhotos(false);
      setUploadProgress([]);
    }
  };

  // 프로필 이미지 업로드 함수
  const handleProfileImageUpload = async (file) => {
    if (!agencyData?._id) {
      alert('Agency information not loaded. Please refresh the page.');
      return;
    }

    try {
      const url = await uploadProfilePhoto(file, agencyData._id);
      
      // API 업데이트
      const res = await fetch('/api/agency/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: url }),
      });

      if (res.ok) {
        alert('프로필 이미지가 성공적으로 업데이트되었습니다!');
        await fetchDashboardData();
      } else {
        alert('프로필 이미지 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Profile upload error:', error);
      alert(`업로드 실패: ${error.message}`);
    }
  };

  // 배경 이미지 업로드 함수
  const handleBackgroundImageUpload = async (file) => {
    if (!agencyData?._id) {
      alert('Agency information not loaded. Please refresh the page.');
      return;
    }

    try {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 배경 이미지 전용 업로드 함수 사용
      const url = await uploadBackgroundImage(file, agencyData._id);
      
      // API 업데이트
      const res = await fetch('/api/agency/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ backgroundImage: url }),
      });

      if (res.ok) {
        alert('배경 이미지가 성공적으로 업데이트되었습니다!');
        await fetchDashboardData();
      } else {
        alert('배경 이미지 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Background image upload error:', error);
      alert(`배경 이미지 업로드 실패: ${error.message}`);
    }
  };

  const handleUpdateAboutMe = async () => {
    setAboutMeLoading(true);
    try {
      const res = await fetch('/api/agency/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aboutMe }),
      });

      if (res.ok) {
        alert('About Me updated successfully!');
      } else {
        alert('Failed to update About Me.');
      }
    } catch (error) {
      console.error('Error updating About Me:', error);
      alert('An error occurred while updating About Me.');
    } finally {
      setAboutMeLoading(false);
    }
  };

  const handleInquiryResponse = async (inquiryId, response) => {
    try {
      const res = await fetch(`/api/agency/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response, status: 'in-progress' }),
      });

      if (res.ok) {
        alert('Response sent successfully!');
        fetchDashboardData();
      } else {
        alert('Failed to send response.');
      }
    } catch (error) {
      console.error('Error responding to inquiry:', error);
      alert('An error occurred while sending the response.');
    }
  };

  const handleConfirmInquiry = async (inquiryId) => {
    try {
      const res = await fetch(`/api/agency/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (res.ok) {
        alert('Inquiry confirmed successfully!');
        fetchDashboardData();
      } else {
        alert('Failed to confirm inquiry.');
      }
    } catch (error) {
      console.error('Error confirming inquiry:', error);
      alert('An error occurred while confirming the inquiry.');
    }
  };

  const handleCancelBooking = async (inquiryId) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/agency/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        alert('Booking cancelled successfully.');
        fetchDashboardData();
      } else {
        alert('Failed to cancel booking.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An error occurred while cancelling the booking.');
    }
  };

  // Check if user is agency
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <Link href="/login" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== 'agency') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">This page is only accessible to agency accounts.</p>
          <Link href="/" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Agency Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {session.user.name || session.user.email}!
            </p>
          </div>
          
          {/* View Profile Button */}
          {agencyData?._id && (
            <a
              href={`/agencies/${agencyData._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View My Profile
            </a>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Inquiries ({inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').length})
              </button>
              <button
                onClick={() => setActiveTab('confirmed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'confirmed'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Confirmed Inquiries ({inquiries.filter(i => i.status === 'confirmed').length})
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cancelled'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cancelled Inquiries ({inquiries.filter(i => i.status === 'cancelled').length})
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Schedule
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Pending Inquiries Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Pending Travel Inquiries</h2>
            
            {inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">📬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending inquiries</h3>
                <p className="text-gray-600">All inquiries have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').map((inquiry) => (
                  <div key={inquiry._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {inquiry.userName} ({inquiry.userEmail})
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>📅 {inquiry.travelDates}</span>
                            <span>👥 {inquiry.groupSize} people</span>
                            <span>🕐 {formatDate(inquiry.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            inquiry.status === 'in-progress' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {inquiry.status === 'in-progress' ? 'In Progress' : 'Pending'}
                          </span>
                          <button
                            onClick={() => handleCancelBooking(inquiry._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            ✗ Cancel
                          </button>
                          {inquiry.status === 'in-progress' && (
                            <button
                              onClick={() => handleConfirmInquiry(inquiry._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              ✓ Confirm Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="p-6">
                      {/* Customer Message */}
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-auto px-2 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                            Customer
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-lg p-3">
                              <p className="text-gray-900">{inquiry.message}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDateTime(inquiry.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Agency Responses */}
                      {inquiry.responses && inquiry.responses.map((response, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex items-start space-x-3 justify-end">
                            <div className="flex-1 text-right">
                              <div className="bg-red-100 rounded-lg p-3 inline-block max-w-md">
                                <p className="text-gray-900">{response.message}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                You • {formatDateTime(response.createdAt)}
                              </p>
                            </div>
                            <div className="w-auto px-2 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium">
                              You
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Legacy single response support */}
                      {inquiry.response && !inquiry.responses && (
                        <div className="mb-4">
                          <div className="flex items-start space-x-3 justify-end">
                            <div className="flex-1 text-right">
                              <div className="bg-red-100 rounded-lg p-3 inline-block max-w-md">
                                <p className="text-gray-900">{inquiry.response}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                You • {inquiry.respondedAt ? formatDateTime(inquiry.respondedAt) : 'Just now'}
                              </p>
                            </div>
                            <div className="w-auto px-2 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium">
                              You
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Response Form */}
                      <div className="border-t pt-4 mt-4">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const response = e.target.response.value;
                          if (response.trim()) {
                            handleInquiryResponse(inquiry._id, response);
                            e.target.response.value = '';
                          }
                        }}>
                          <div className="flex space-x-3">
                            <div className="w-auto px-2 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                              You
                            </div>
                            <div className="flex-1">
                              <textarea
                                name="response"
                                rows="3"
                                required
                                placeholder="Type your response..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-none"
                              ></textarea>
                              <div className="flex justify-end mt-2">
                                <button
                                  type="submit"
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                  Send Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Confirmed Inquiries Tab */}
        {activeTab === 'confirmed' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Confirmed Travel Inquiries</h2>
            
            {inquiries.filter(i => i.status === 'confirmed').length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No confirmed inquiries</h3>
                <p className="text-gray-600">Once you confirm inquiries, they&apos;ll appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.filter(i => i.status === 'confirmed').map((inquiry) => (
                  <div key={inquiry._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inquiry.userName} ({inquiry.userEmail})
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Confirmed
                        </span>
                        <button
                          onClick={() => handleCancelBooking(inquiry._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Travel Date:</span>
                        <p className="text-gray-900">{inquiry.travelDates}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Group Size:</span>
                        <p className="text-gray-900">{inquiry.groupSize}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500">Original Message:</span>
                      <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-auto px-2 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                            Customer
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900">{inquiry.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDateTime(inquiry.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conversation History */}
                    {((inquiry.responses && inquiry.responses.length > 0) || inquiry.response) && (
                      <div className="border-t pt-4">
                        <span className="text-sm font-medium text-gray-500 mb-3 block">Conversation History:</span>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {/* Show new responses array if available */}
                          {inquiry.responses && inquiry.responses.length > 0 ? (
                            inquiry.responses.map((response, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-auto px-2 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium">
                                  You
                                </div>
                                <div className="flex-1">
                                  <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                                    <p className="text-gray-900">{response.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatDateTime(response.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            /* Show legacy single response if no responses array */
                            inquiry.response && (
                              <div className="flex items-start space-x-3">
                                <div className="w-auto px-2 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium">
                                  You
                                </div>
                                <div className="flex-1">
                                  <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                                    <p className="text-gray-900">{inquiry.response}</p>
                                    {inquiry.respondedAt && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {formatDateTime(inquiry.respondedAt)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cancelled Inquiries Tab */}
        {activeTab === 'cancelled' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Cancelled Inquiries</h2>
            
            {inquiries.filter(i => i.status === 'cancelled').length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cancelled inquiries</h3>
                <p className="text-gray-600">All inquiries are still active or confirmed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.filter(i => i.status === 'cancelled').map((inquiry) => (
                  <div key={inquiry._id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-red-500">
                    {/* Header */}
                    <div className="bg-red-50 px-6 py-4 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {inquiry.userName} ({inquiry.userEmail})
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>📅 {inquiry.travelDates}</span>
                            <span>👥 {inquiry.groupSize} people</span>
                            <span>🕐 {formatDate(inquiry.createdAt)}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Customer Message */}
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-auto px-2 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                            Customer
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-lg p-3">
                              <p className="text-gray-900">{inquiry.message}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDateTime(inquiry.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Agency Responses */}
                      {inquiry.responses && inquiry.responses.length > 0 && (
                        <div className="space-y-3">
                          {inquiry.responses.map((response, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-auto px-2 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium">
                                You
                              </div>
                              <div className="flex-1">
                                <div className="bg-red-50 rounded-lg p-3">
                                  <p className="text-gray-900">{response.message}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDateTime(response.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Cancellation Notice */}
                      <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>⚠️ This inquiry has been cancelled.</strong> No further actions are available.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Travel Schedule</h2>
            
            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
                <p className="text-sm text-gray-600">Click on any event to see details</p>
              </div>
              
              <div style={{ height: '600px' }}>
                <Calendar
                  localizer={localizer}
                  events={inquiries
                    .filter(i => i.status === 'confirmed')
                    .map(inquiry => {
                      // Handle different date formats and separators
                      let dates;
                      let startDate, endDate;
                      
                      // Try different separators: ' - ', ' to ', ' ~ '
                      if (inquiry.travelDates.includes(' to ')) {
                        dates = inquiry.travelDates.split(' to ');
                      } else if (inquiry.travelDates.includes(' - ')) {
                        dates = inquiry.travelDates.split(' - ');
                      } else if (inquiry.travelDates.includes(' ~ ')) {
                        dates = inquiry.travelDates.split(' ~ ');
                      } else {
                        dates = [inquiry.travelDates]; // Single day
                      }
                      
                      if (dates.length === 2) {
                        // Multi-day trip
                        startDate = new Date(dates[0].trim());
                        endDate = new Date(dates[1].trim());
                      } else {
                        // Single day trip
                        startDate = new Date(inquiry.travelDates.trim());
                        endDate = new Date(inquiry.travelDates.trim());
                      }
                      
                      const color = getInquiryColor(inquiry._id);
                      
                      return {
                        id: inquiry._id,
                        title: `${inquiry.userName} (${inquiry.groupSize} people)`,
                        start: startDate,
                        end: endDate,
                        allDay: true,
                        resource: {
                          inquiry,
                          color
                        }
                      };
                    })
                  }
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  eventPropGetter={(event) => {
                    const backgroundColor = event.resource.color;
                    return {
                      style: {
                        backgroundColor,
                        borderColor: backgroundColor,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }
                    };
                  }}
                  onSelectEvent={(event) => {
                    const inquiry = event.resource.inquiry;
                    alert(
                      `Guest: ${inquiry.userName}\n` +
                      `Email: ${inquiry.userEmail}\n` +
                      `Dates: ${inquiry.travelDates}\n` +
                      `Group Size: ${inquiry.groupSize} people\n` +
                      `Message: ${inquiry.message}`
                    );
                  }}
                  views={['month', 'week', 'day']}
                  defaultView='month'
                  date={calendarDate}
                  onNavigate={(date) => setCalendarDate(date)}
                  popup
                  tooltipAccessor={(event) => 
                    `${event.resource.inquiry.userName} - ${event.resource.inquiry.groupSize} people`
                  }
                />
              </div>
            </div>
            
            {/* Legend and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Color Legend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Bookings</h3>
                {inquiries.filter(i => i.status === 'confirmed').length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📅</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No confirmed bookings</h4>
                    <p className="text-gray-600">Confirmed inquiries will appear on the calendar.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {inquiries.filter(i => i.status === 'confirmed').map((inquiry) => {
                      const color = getInquiryColor(inquiry._id);
                      return (
                        <div key={inquiry._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{inquiry.userName}</h4>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span>📅 {inquiry.travelDates}</span>
                              <span>👥 {inquiry.groupSize} people</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs text-gray-400">
                              {formatDate(inquiry.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="text-sm text-blue-800">Total Confirmed</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {inquiries.filter(i => i.status === 'confirmed').length}
                      </div>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="text-sm text-green-800">Total Travelers</div>
                      <div className="text-2xl font-bold text-green-600">
                        {inquiries.filter(i => i.status === 'confirmed').reduce((sum, inquiry) => {
                          return sum + parseInt(inquiry.groupSize || 0);
                        }, 0)}
                      </div>
                    </div>
                    <div className="text-3xl">👥</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="text-sm text-yellow-800">This Month</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {inquiries.filter(i => {
                          if (i.status !== 'confirmed') return false;
                          const currentMonth = moment().month();
                          const currentYear = moment().year();
                          const travelDate = moment(i.travelDates.split(' - ')[0], ['MM/DD/YYYY', 'YYYY-MM-DD']);
                          return travelDate.month() === currentMonth && travelDate.year() === currentYear;
                        }).length}
                      </div>
                    </div>
                    <div className="text-3xl">📅</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            
            {/* About Me Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tell potential travelers about yourself! Share your experience, interests, and what makes you special as a travel guide. 
                This will appear on your public profile page. (3-4 lines recommended)
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  placeholder="Write about yourself here... For example: Hi! I'm passionate about sharing Korea's hidden gems with travelers. With 5 years of experience as a local guide, I love showing visitors our beautiful temples, delicious street food, and vibrant culture. Let me help you create unforgettable memories in Korea!"
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  maxLength="500"
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {aboutMe.length}/500 characters
                  </span>
                  
                  <button
                    onClick={handleUpdateAboutMe}
                    disabled={aboutMeLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      aboutMeLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {aboutMeLoading ? 'Saving...' : 'Save About Me'}
                  </button>
                </div>
              </div>
              
              {/* Preview */}
              {aboutMe && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview:</h4>
                  <p className="text-gray-700 whitespace-pre-line">{aboutMe}</p>
                </div>
              )}
            </div>

            {/* Profile Image Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h3>
              
              {/* Current Profile Image */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {agencyData?.image ? (
                      <img 
                        src={agencyData.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-3xl text-gray-400">🏢</div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{agencyData?.name || 'Agency Name'}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload a professional profile photo that represents your agency
                  </p>
                </div>
              </div>

              {/* Upload Input */}
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleProfileImageUpload(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                <p className="text-xs text-gray-500">
                  📸 Recommended: Square image, max 2MB, JPG/PNG format
                </p>
              </div>
            </div>

            {/* Background Image Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Background Image</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a stunning background image for your agency card. This will be the first thing travelers see! 
                Consider using beautiful Korean landscapes, cultural sites, or food photos.
              </p>
              
              {/* Current Background Image */}
              <div className="mb-6">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-orange-500">
                  {agencyData?.backgroundImage ? (
                    <img 
                      src={agencyData.backgroundImage} 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">🏔️</div>
                        <p className="text-sm font-medium">No background image</p>
                        <p className="text-xs opacity-75">Upload one to make your profile stand out!</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Preview Profile on Background */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white">
                      {agencyData?.image ? (
                        <img 
                          src={agencyData.image} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">🏢</div>
                      )}
                    </div>
                    <div className="text-white">
                      <h4 className="font-medium text-sm">{agencyData?.name || 'Agency Name'}</h4>
                      <p className="text-xs opacity-90">{agencyData?.tagline || 'Your tagline here'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Input */}
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleBackgroundImageUpload(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500">
                  🌄 Recommended: Wide landscape image (16:9 ratio), max 5MB, JPG/PNG format
                </p>
                
                {/* Inspiration */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">💡 Background Image Ideas:</h5>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p>🏯 <strong>Cultural:</strong> Gyeongbokgung Palace, Bukchon Hanok Village, Traditional temples</p>
                    <p>🌸 <strong>Nature:</strong> Cherry blossoms, Jeju Island, Han River, Seoraksan National Park</p>
                    <p>🍜 <strong>Food:</strong> Korean BBQ, Colorful banchan, Traditional market scenes</p>
                    <p>🏙️ <strong>Modern:</strong> Seoul skyline, Gangnam district, Busan beaches</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Photos Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Photo Gallery</h3>
              <p className="text-sm text-gray-600 mb-6">
                Upload photos from your travel experiences to showcase your expertise and attract more customers.
                These photos will appear in your public profile gallery.
              </p>

              {/* Current Photos Count */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Current Photos: {agencyData?.travelPhotos?.length || 0}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Upload high-quality photos of Korean attractions, food, and cultural experiences
                    </p>
                  </div>
                  <div className="text-3xl">📷</div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      if (files.length > 10) {
                        alert('한 번에 최대 10개의 파일만 업로드할 수 있습니다.');
                        return;
                      }
                      handleTravelPhotosUpload(files);
                    }
                  }}
                  disabled={uploadingPhotos}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                />

                {/* Upload Progress */}
                {uploadingPhotos && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">업로드 중...</p>
                    {uploadProgress.map((progress, index) => (
                      <div key={index} className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    ✅ Multiple files supported (max 10 at once)<br/>
                    ✅ Formats: JPG, PNG, WEBP<br/>
                    ✅ Max size: 5MB per file
                  </div>
                  <div>
                    💡 Tips:<br/>
                    • High-resolution photos work best<br/>
                    • Showcase diverse Korean experiences<br/>
                    • Include both landmarks and local culture
                  </div>
                </div>
              </div>

              {/* Recent Photos Preview */}
              {agencyData?.travelPhotos && agencyData.travelPhotos.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Photos</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {agencyData.travelPhotos.slice(-8).map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={photo} 
                          alt={`Travel photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {agencyData.travelPhotos.length > 8 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      +{agencyData.travelPhotos.length - 8} more photos in your gallery
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}