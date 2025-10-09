'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [savedTravelPlans, setSavedTravelPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [activeInquiryTab, setActiveInquiryTab] = useState('in-progress'); // 'in-progress', 'confirmed', 'cancelled'
  const [replyMessages, setReplyMessages] = useState({}); // Store reply messages for each inquiry
  const [calendarDate, setCalendarDate] = useState(new Date()); // Calendar navigation state

  // Safe date formatting functions
  const formatDate = (dateValue) => {
    if (!dateValue) return 'No date';
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      const parsedDate = new Date(dateValue.toString());
      if (isNaN(parsedDate.getTime())) return 'Invalid date';
      return parsedDate.toLocaleDateString('en-US');
    }
    return date.toLocaleDateString('en-US');
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return 'No date';
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      const parsedDate = new Date(dateValue.toString());
      if (isNaN(parsedDate.getTime())) return 'Invalid date';
      return `${parsedDate.toLocaleDateString('en-US')} at ${parsedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${date.toLocaleDateString('en-US')} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Calendar setup
  const localizer = momentLocalizer(moment);
  
  // Color palette for different agencies/statuses
  const statusColors = {
    'pending': '#5C7F9A',
    'in-progress': '#5C7F9A', 
    'confirmed': '#10B981',
    'cancelled': '#EF4444'
  };
  
  // Generate color for inquiry based on status
  const getInquiryColor = (inquiry) => {
    return statusColors[inquiry.status] || '#6B7280';
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role === 'agency') {
      router.push('/login');
      return;
    }

    fetchInquiries();
    fetchSavedTravelPlans();
  }, [session, status, router]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/user/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedTravelPlans = async () => {
    try {
      setPlansLoading(true);
      
      const response = await fetch('/api/travel-plans');
      
      if (response.ok) {
        const data = await response.json();
        setSavedTravelPlans(data);
      } else {
        setSavedTravelPlans([]);
      }
    } catch (error) {
      console.error('Error fetching saved travel plans:', error);
      setSavedTravelPlans([]);
    } finally {
      setPlansLoading(false);
    }
  };

  const deleteTravelPlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this travel plan?')) {
      return;
    }

    try {
      const response = await fetch(`/api/travel-plans?id=${planId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // 성공적으로 삭제되면 목록에서 제거
        setSavedTravelPlans(prev => prev.filter(plan => plan._id !== planId));
      } else {
        const result = await response.json();
        alert('Failed to delete travel plan: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting travel plan:', error);
      alert('Failed to delete travel plan. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-white' + ' ' + 'font-semibold';
      case 'in-progress':
        return 'text-white' + ' ' + 'font-semibold';
      case 'pending':
        return 'text-white' + ' ' + 'font-semibold';
      case 'cancelled':
        return 'text-white' + ' ' + 'font-semibold';
      default:
        return 'text-white' + ' ' + 'font-semibold';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10B981';
      case 'in-progress':
        return '#5C7F9A';
      case 'pending':
        return '#5C7F9A';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#8D6E63';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  // Handle sending reply message
  const handleSendReply = async (inquiryId) => {
    const message = replyMessages[inquiryId];
    if (!message || !message.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      const response = await fetch(`/api/user/inquiries/${inquiryId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (response.ok) {
        // Clear the message and refresh inquiries
        setReplyMessages(prev => ({ ...prev, [inquiryId]: '' }));
        fetchInquiries();
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('An error occurred while sending the message');
    }
  };

  // Handle reply message change
  const handleReplyChange = (inquiryId, message) => {
    setReplyMessages(prev => ({ ...prev, [inquiryId]: message }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderBottomColor: '#B71C1C'}}></div>
          <p className="mt-4" style={{color: '#8D6E63'}}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{color: '#B71C1C'}}>Login Required</h2>
          <Link href="/login" className="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#B71C1C'}}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (session?.user?.role === 'agency') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{color: '#B71C1C'}}>Access Denied</h2>
          <p className="mb-4" style={{color: '#8D6E63'}}>This page is for travelers only.</p>
          <Link href="/agency-dashboard" className="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#B71C1C'}}>
            Go to Agency Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{color: '#B71C1C'}}>
            My Travel Dashboard
          </h1>
          <p style={{color: '#8D6E63'}}>
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>

        {/* View Toggle */}
        <div className="mb-8">
          <div style={{borderBottomColor: '#8D6E63', borderBottomWidth: '1px'}}>
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'dashboard'
                    ? 'text-white'
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  borderBottomColor: activeView === 'dashboard' ? '#B71C1C' : 'transparent',
                  color: activeView === 'dashboard' ? '#B71C1C' : '#8D6E63'
                }}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'calendar'
                    ? 'text-white'
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  borderBottomColor: activeView === 'calendar' ? '#B71C1C' : 'transparent',
                  color: activeView === 'calendar' ? '#B71C1C' : '#8D6E63'
                }}
              >
                My Travel Calendar
              </button>
              <button
                onClick={() => setActiveView('saved-plans')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'saved-plans'
                    ? 'text-white'
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  borderBottomColor: activeView === 'saved-plans' ? '#B71C1C' : 'transparent',
                  color: activeView === 'saved-plans' ? '#B71C1C' : '#8D6E63'
                }}
              >
                Saved Plans
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-3 md:p-6" style={{borderLeft: '4px solid #B71C1C'}}>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 mb-2 md:mb-0 hidden md:block">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#F8F4EC'}}>
                      <span className="text-xs md:text-sm font-semibold" style={{color: '#B71C1C'}}>ALL</span>
                    </div>
                  </div>
                  <div className="md:ml-4">
                    <h3 className="text-sm md:text-lg font-medium" style={{color: '#2E2E2E'}}>Total</h3>
                    <p className="text-xl md:text-3xl font-bold" style={{color: '#B71C1C'}}>{inquiries.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-3 md:p-6" style={{borderLeft: '4px solid #5C7F9A'}}>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 mb-2 md:mb-0 hidden md:block">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#F8F4EC'}}>
                      <span className="text-xs md:text-sm font-semibold" style={{color: '#5C7F9A'}}>PROG</span>
                    </div>
                  </div>
                  <div className="md:ml-4">
                    <h3 className="text-sm md:text-lg font-medium" style={{color: '#2E2E2E'}}>Progress</h3>
                    <p className="text-xl md:text-3xl font-bold" style={{color: '#5C7F9A'}}>
                      {inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-3 md:p-6" style={{borderLeft: '4px solid #10B981'}}>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 mb-2 md:mb-0 hidden md:block">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#F8F4EC'}}>
                      <span className="text-sm md:text-xl">✓</span>
                    </div>
                  </div>
                  <div className="md:ml-4">
                    <h3 className="text-sm md:text-lg font-medium" style={{color: '#2E2E2E'}}>Confirmed</h3>
                    <p className="text-xl md:text-3xl font-bold" style={{color: '#10B981'}}>
                      {inquiries.filter(i => i.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-3 md:p-6" style={{borderLeft: '4px solid #EF4444'}}>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 mb-2 md:mb-0 hidden md:block">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#F8F4EC'}}>
                      <span className="text-sm md:text-xl">✕</span>
                    </div>
                  </div>
                  <div className="md:ml-4">
                    <h3 className="text-sm md:text-lg font-medium" style={{color: '#2E2E2E'}}>Cancelled</h3>
                    <p className="text-xl md:text-3xl font-bold" style={{color: '#EF4444'}}>
                      {inquiries.filter(i => i.status === 'cancelled').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div style={{borderBottomColor: '#8D6E63', borderBottomWidth: '1px'}}>
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveInquiryTab('in-progress')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm`}
                    style={{
                      borderBottomColor: activeInquiryTab === 'in-progress' ? '#5C7F9A' : 'transparent',
                      color: activeInquiryTab === 'in-progress' ? '#5C7F9A' : '#8D6E63'
                    }}
                  >
                    In Progress ({inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').length})
                  </button>
                  <button
                    onClick={() => setActiveInquiryTab('confirmed')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm`}
                    style={{
                      borderBottomColor: activeInquiryTab === 'confirmed' ? '#10B981' : 'transparent',
                      color: activeInquiryTab === 'confirmed' ? '#10B981' : '#8D6E63'
                    }}
                  >
                    Confirmed ({inquiries.filter(i => i.status === 'confirmed').length})
                  </button>
                  <button
                    onClick={() => setActiveInquiryTab('cancelled')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm`}
                    style={{
                      borderBottomColor: activeInquiryTab === 'cancelled' ? '#EF4444' : 'transparent',
                      color: activeInquiryTab === 'cancelled' ? '#EF4444' : '#8D6E63'
                    }}
                  >
                    Cancelled ({inquiries.filter(i => i.status === 'cancelled').length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* In Progress Tab */}
                {activeInquiryTab === 'in-progress' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4" style={{color: '#B71C1C'}}>Active Conversations</h3>
                    {inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <h4 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>No active conversations</h4>
                        <p className="mb-4" style={{color: '#8D6E63'}}>Start planning your Korean adventure!</p>
                        <Link 
                          href="/agencies"
                          className="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity inline-block"
                          style={{backgroundColor: '#B71C1C'}}
                        >
                          Find Travel Agencies
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').map((inquiry) => (
                          <div key={inquiry._id} className="rounded-lg p-6 hover:shadow-md transition-shadow" 
                               style={{border: '1px solid #8D6E63'}}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>
                                  {inquiry.agencyName || 'Travel Agency'}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm" style={{color: '#8D6E63'}}>
                                  <span>📅 {inquiry.travelDates}</span>
                                  <span>👥 {inquiry.groupSize} people</span>
                                  <span>📋 {formatDate(inquiry.createdAt)}</span>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(inquiry.status)}`}
                                    style={{backgroundColor: getStatusBgColor(inquiry.status)}}>
                                {getStatusText(inquiry.status)}
                              </span>
                            </div>
                            
                            {/* Chat History */}
                            <div className="rounded-lg p-4 mb-4 max-h-80 overflow-y-auto" style={{backgroundColor: '#F8F4EC'}}>
                              {/* Original Message */}
                              <div className="mb-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {session?.user?.image ? (
                                      <Image 
                                        src={session.user.image} 
                                        alt="Your profile" 
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-xs font-semibold text-gray-600">
                                        {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-white rounded-lg p-3 border">
                                      <p className="text-gray-900">{inquiry.message}</p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {formatDateTime(inquiry.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Agency Responses */}
                              {inquiry.responses && inquiry.responses.length > 0 && (
                                <div className="space-y-3">
                                  {inquiry.responses.map((response, index) => (
                                    <div key={index} className={`flex items-start space-x-3 ${response.sender === 'user' ? 'justify-end' : ''}`}>
                                      {response.sender !== 'user' && (
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#5C7F9A] flex items-center justify-center">
                                          {inquiry.agencyImage ? (
                                            <Image 
                                              src={inquiry.agencyImage} 
                                              alt="Agency profile" 
                                              width={32}
                                              height={32}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <span className="text-xs font-semibold text-white">
                                              {inquiry.agencyName?.charAt(0) || 'A'}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      <div className="flex-1 max-w-md">
                                        <div className={`rounded-lg p-3 border ${
                                          response.sender === 'user' 
                                            ? 'bg-blue-50 border-blue-200 ml-auto text-right' 
                                            : 'bg-green-50 border-green-200'
                                        }`}>
                                          <p className="text-gray-900">{response.message}</p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            {response.sender === 'user' ? 'You • ' : ''}{formatDateTime(response.timestamp)}
                                          </p>
                                        </div>
                                      </div>
                                      {response.sender === 'user' && (
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                          {session?.user?.image ? (
                                            <Image 
                                              src={session.user.image} 
                                              alt="Your profile" 
                                              width={32}
                                              height={32}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <span className="text-xs font-semibold text-gray-600">
                                              {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Reply Box */}
                            <div className="border-t pt-4" style={{borderTopColor: '#8D6E63'}}>
                              <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <textarea
                                    value={replyMessages[inquiry._id] || ''}
                                    onChange={(e) => handleReplyChange(inquiry._id, e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full p-3 rounded-lg resize-none focus:ring-2 focus:outline-none"
                                    style={{
                                      border: '1px solid #8D6E63',
                                      focusRingColor: '#B71C1C',
                                      focusBorderColor: '#B71C1C'
                                    }}
                                    rows="2"
                                  />
                                </div>
                                <button
                                  onClick={() => handleSendReply(inquiry._id)}
                                  className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                                  style={{backgroundColor: '#B71C1C'}}
                                >
                                  <span>Send</span>
                                  <span>📤</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Confirmed Tab */}
                {activeInquiryTab === 'confirmed' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4" style={{color: '#B71C1C'}}>Confirmed Bookings</h3>
                    {inquiries.filter(i => i.status === 'confirmed').length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">✓</div>
                        <h4 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>No confirmed bookings</h4>
                        <p style={{color: '#8D6E63'}}>Your confirmed trips will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.filter(i => i.status === 'confirmed').map((inquiry) => (
                          <div key={inquiry._id} className="rounded-lg p-6" 
                               style={{border: '1px solid #10B981', backgroundColor: '#F0FDF4'}}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>
                                  {inquiry.agencyName || 'Travel Agency'}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm" style={{color: '#8D6E63'}}>
                                  <span>📅 {inquiry.travelDates}</span>
                                  <span>👥 {inquiry.groupSize} people</span>
                                  <span>📋 {formatDate(inquiry.createdAt)}</span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✅ Confirmed
                              </span>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Your Trip Details:</h4>
                              <p className="text-gray-600 bg-white p-3 rounded-lg border">{inquiry.message}</p>
                            </div>

                            {inquiry.responses && inquiry.responses.length > 0 && (
                              <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Final Confirmation:</h4>
                                <div className="bg-white p-3 rounded-lg border border-green-200">
                                  <p className="text-gray-800">{inquiry.responses[inquiry.responses.length - 1].message}</p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Confirmed on {formatDate(inquiry.responses[inquiry.responses.length - 1].timestamp)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Cancelled Tab */}
                {activeInquiryTab === 'cancelled' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4" style={{color: '#B71C1C'}}>Cancelled Inquiries</h3>
                    {inquiries.filter(i => i.status === 'cancelled').length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">✕</div>
                        <h4 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>No cancelled inquiries</h4>
                        <p style={{color: '#8D6E63'}}>Your cancelled inquiries will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.filter(i => i.status === 'cancelled').map((inquiry) => (
                          <div key={inquiry._id} className="rounded-lg p-6" 
                               style={{border: '1px solid #EF4444', backgroundColor: '#FEF2F2'}}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>
                                  {inquiry.agencyName || 'Travel Agency'}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm" style={{color: '#8D6E63'}}>
                                  <span>📅 {inquiry.travelDates}</span>
                                  <span>👥 {inquiry.groupSize} people</span>
                                  <span>📋 {formatDate(inquiry.createdAt)}</span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                    style={{backgroundColor: '#EF4444'}}>
                                ✕ Cancelled
                              </span>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2" style={{color: '#2E2E2E'}}>Original Request:</h4>
                              <p className="bg-white p-3 rounded-lg" style={{color: '#8D6E63', border: '1px solid #EF4444'}}>{inquiry.message}</p>
                            </div>

                            <div className="border-t pt-4" style={{borderTopColor: '#EF4444'}}>
                              <div className="flex items-center" style={{color: '#EF4444'}}>
                                <span className="mr-2">⚠️</span>
                                <span className="text-sm font-medium">This inquiry has been cancelled by the travel agency.</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-md p-0 md:p-6">
              <div className="mb-3 md:mb-4 px-3 md:px-0">
                <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2" style={{color: '#B71C1C'}}>My Travel Calendar</h2>
                <p className="text-xs md:text-sm" style={{color: '#8D6E63'}}>View all your travel plans and bookings</p>
              </div>
              
              <div className="h-96 md:h-[600px] px-3 md:px-0">
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
                      
                      const color = getInquiryColor(inquiry);
                      
                      const event = {
                        id: inquiry._id,
                        title: `✈️ with ${inquiry.agencyName || 'Travel Agency'}`,
                        start: startDate,
                        end: endDate,
                        allDay: true,
                        resource: {
                          inquiry,
                          color
                        }
                      };
                      
                      return event;
                    })}
                  startAccessor="start"
                  endAccessor="end"
                  className="h-full"
                  views={['month']}
                  defaultView='month'
                  date={calendarDate}
                  onNavigate={(date) => setCalendarDate(date)}
                  popup
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
                    const inquiry = event.resource?.inquiry;
                    if (!inquiry) {
                      alert(`Event: ${event.title || 'Test Event'}`);
                      return;
                    }
                    alert(
                      `🧳 Trip Details\n\n` +
                      `Travel Agency: ${inquiry.agencyName || 'Travel Agency'}\n` +
                      `Travel Dates: ${inquiry.travelDates}\n` +
                      `Group Size: ${inquiry.groupSize} people\n` +
                      `Status: ${getStatusText(inquiry.status)}\n\n` +
                      `Your Message: ${inquiry.message}`
                    );
                  }}
                  tooltipAccessor={(event) => {
                    if (!event.resource?.inquiry) {
                      return event.title || 'Event';
                    }
                    return `${event.resource.inquiry.agencyName || 'Travel Agency'} - ${event.resource.inquiry.groupSize} people`;
                  }}
                />
              </div>
            </div>
            
            {/* Travel Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Trips */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Trips</h3>
                {inquiries.filter(i => i.status === 'confirmed').length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🗓️</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No confirmed trips</h4>
                    <p className="text-gray-600">Book your Korean adventure!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {inquiries.filter(i => i.status === 'confirmed').map((inquiry) => {
                      const color = getInquiryColor(inquiry);
                      return (
                        <div key={inquiry._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {inquiry.agencyName || 'Travel Agency'}
                            </h4>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span>📅 {inquiry.travelDates}</span>
                              <span>👥 {inquiry.groupSize} people</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Confirmed
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Travel Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Travel Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="text-sm text-green-800">Confirmed Trips</div>
                      <div className="text-2xl font-bold text-green-600">
                        {inquiries.filter(i => i.status === 'confirmed').length}
                      </div>
                    </div>
                    <div className="text-3xl">✈️</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="text-sm text-blue-800">In Progress</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {inquiries.filter(i => i.status === 'in-progress').length}
                      </div>
                    </div>
                    <div className="text-3xl">💬</div>
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

        {/* Saved Plans View */}
        {activeView === 'saved-plans' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{color: '#B71C1C'}}>My Saved Travel Plans</h2>
              <p className="text-sm md:text-base" style={{color: '#8D6E63'}}>
                AI-generated travel plans saved for your reference
              </p>
            </div>

            {/* Saved Plans Content */}
            {plansLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">⏳</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Saved Plans...</h3>
                <p className="text-gray-600">Please wait while we fetch your travel plans.</p>
              </div>
            ) : savedTravelPlans.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 text-8xl mb-6">🗺️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">No Saved Travel Plans</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create personalized AI travel plans and save them here for easy access anytime.
                </p>
                <Link 
                  href="/ai-planner"
                  className="inline-block px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                  style={{backgroundColor: '#B71C1C'}}
                >
                  Create Your First AI Travel Plan
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {savedTravelPlans.map((plan) => (
                  <div key={plan._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Plan Header */}
                    <div className="border-b border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                          <p className="text-gray-600 mb-4">{plan.overview}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <span>⏱️</span>
                              <span>Duration: {plan.formData.duration === 'custom' ? `${plan.formData.customDuration} days` : plan.formData.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>👥</span>
                              <span>Group: {plan.formData.groupSize}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>💰</span>
                              <span>Budget: ${plan.formData.totalBudget}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>📅</span>
                              <span>Saved: {formatDate(plan.savedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button 
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            className="px-4 py-2 text-sm text-white rounded-lg transition-colors hover:opacity-90"
                            style={{backgroundColor: '#B71C1C'}}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Plan Preview */}
                    <div className="p-6">
                      <h4 className="font-bold text-gray-900 mb-3">Itinerary Preview</h4>
                      <div className="space-y-3">
                        {plan.itinerary.slice(0, 2).map((day, dayIndex) => (
                          <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">Day {day.day}: {day.theme}</h5>
                            <div className="space-y-1">
                              {day.activities.slice(0, 2).map((activity, actIndex) => (
                                <div key={actIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                                  <span className="font-medium text-blue-600 min-w-0 w-12">{activity.time}</span>
                                  <span className="font-medium">{activity.place}</span>
                                  <span>- {activity.description}</span>
                                </div>
                              ))}
                              {day.activities.length > 2 && (
                                <div className="text-sm text-gray-500 italic">
                                  + {day.activities.length - 2} more activities...
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {plan.itinerary.length > 2 && (
                          <div className="text-center text-sm text-gray-500 italic border border-gray-200 rounded-lg p-3">
                            + {plan.itinerary.length - 2} more days...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex space-x-4">
                          <span className="text-gray-600">Interests: {plan.formData.interests.slice(0, 2).join(', ')}</span>
                          {plan.formData.interests.length > 2 && (
                            <span className="text-gray-500">+{plan.formData.interests.length - 2} more</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => deleteTravelPlan(plan._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">Export</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
