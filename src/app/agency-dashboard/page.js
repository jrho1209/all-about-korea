"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function AgencyDashboardPage() {
  const { data: session } = useSession();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agency Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome, {session.user.name || session.user.email}!
          </p>
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
                <p className="text-gray-600">Once you confirm inquiries, they'll appear here.</p>
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
                      // Parse travel dates
                      const dates = inquiry.travelDates.split(' - ');
                      let startDate, endDate;
                      
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
      </div>
    </div>
  );
}