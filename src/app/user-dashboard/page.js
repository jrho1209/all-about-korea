'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
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
    'pending': '#F59E0B',
    'in-progress': '#3B82F6', 
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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

  if (session?.user?.role === 'agency') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">This page is for travelers only.</p>
          <Link href="/agency-dashboard" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Travel Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>

        {/* View Toggle */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'dashboard'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Dashboard Overview
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'calendar'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🗓️ My Travel Calendar
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Total Inquiries</h3>
                    <p className="text-3xl font-bold text-blue-600">{inquiries.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Confirmed</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {inquiries.filter(i => i.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">❌</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Cancelled</h3>
                    <p className="text-3xl font-bold text-red-600">
                      {inquiries.filter(i => i.status === 'cancelled').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveInquiryTab('in-progress')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeInquiryTab === 'in-progress'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    💬 In Progress ({inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').length})
                  </button>
                  <button
                    onClick={() => setActiveInquiryTab('confirmed')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeInquiryTab === 'confirmed'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ✅ Confirmed ({inquiries.filter(i => i.status === 'confirmed').length})
                  </button>
                  <button
                    onClick={() => setActiveInquiryTab('cancelled')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeInquiryTab === 'cancelled'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ❌ Cancelled ({inquiries.filter(i => i.status === 'cancelled').length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* In Progress Tab */}
                {activeInquiryTab === 'in-progress' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Conversations</h3>
                    {inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No active conversations</h4>
                        <p className="text-gray-600 mb-4">Start planning your Korean adventure!</p>
                        <Link 
                          href="/agencies"
                          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block"
                        >
                          Find Travel Agencies
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.filter(i => i.status === 'pending' || i.status === 'in-progress').map((inquiry) => (
                          <div key={inquiry._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {inquiry.agencyName || 'Travel Agency'}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>📅 {inquiry.travelDates}</span>
                                  <span>👥 {inquiry.groupSize} people</span>
                                  <span>📋 {formatDate(inquiry.createdAt)}</span>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                {getStatusText(inquiry.status)}
                              </span>
                            </div>
                            
                            {/* Chat History */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-80 overflow-y-auto">
                              {/* Original Message */}
                              <div className="mb-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-auto px-2 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                                    You
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
                                        <div className="w-auto px-2 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium">
                                          Agency
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
                                        <div className="w-auto px-2 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                                          You
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Reply Box */}
                            <div className="border-t pt-4">
                              <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <textarea
                                    value={replyMessages[inquiry._id] || ''}
                                    onChange={(e) => handleReplyChange(inquiry._id, e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="2"
                                  />
                                </div>
                                <button
                                  onClick={() => handleSendReply(inquiry._id)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirmed Bookings</h3>
                    {inquiries.filter(i => i.status === 'confirmed').length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">✅</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No confirmed bookings</h4>
                        <p className="text-gray-600">Your confirmed trips will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.filter(i => i.status === 'confirmed').map((inquiry) => (
                          <div key={inquiry._id} className="border border-green-200 rounded-lg p-6 bg-green-50">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {inquiry.agencyName || 'Travel Agency'}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Cancelled Inquiries</h3>
                    {inquiries.filter(i => i.status === 'cancelled').length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">❌</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No cancelled inquiries</h4>
                        <p className="text-gray-600">Your cancelled inquiries will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.filter(i => i.status === 'cancelled').map((inquiry) => (
                          <div key={inquiry._id} className="border border-red-200 rounded-lg p-6 bg-red-50">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {inquiry.agencyName || 'Travel Agency'}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>📅 {inquiry.travelDates}</span>
                                  <span>👥 {inquiry.groupSize} people</span>
                                  <span>📋 {formatDate(inquiry.createdAt)}</span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                ❌ Cancelled
                              </span>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Original Request:</h4>
                              <p className="text-gray-600 bg-white p-3 rounded-lg border">{inquiry.message}</p>
                            </div>

                            <div className="border-t pt-4">
                              <div className="flex items-center text-red-600">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">My Travel Calendar</h2>
                <p className="text-sm text-gray-600">View all your travel plans and bookings</p>
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
                  style={{ height: 500 }}
                  views={['month', 'week', 'day']}
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
      </div>
    </div>
  );
}
