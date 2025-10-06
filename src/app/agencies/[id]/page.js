"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AgencyDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (params.id) {
      fetchAgency();
    }
  }, [params.id]);

  const fetchAgency = async () => {
    try {
      const response = await fetch(`/api/agencies/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAgency(data);
      } else {
        router.push('/agencies');
      }
    } catch (error) {
      console.error('Error fetching agency:', error);
      router.push('/agencies');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (!startDate || !endDate) {
      showToast('Please select both start and end dates.', 'error');
      return;
    }
    
    const startDateStr = startDate.toLocaleDateString('en-US');
    const endDateStr = endDate.toLocaleDateString('en-US');
    const travelDates = `${startDateStr} to ${endDateStr}`;
    
    const contactData = {
      agencyId: params.id,
      userEmail: session?.user?.email,
      userName: session?.user?.name,
      message: formData.get('message'),
      travelDates: travelDates,
      startDate: startDateStr,
      endDate: endDateStr,
      groupSize: formData.get('groupSize'),
    };

    try {
      const response = await fetch('/api/contact-agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        showToast('🎉 Your travel inquiry has been sent successfully! We\'ll get back to you soon.', 'success');
        setShowContactForm(false);
        // Reset form
        setStartDate(null);
        setEndDate(null);
      } else {
        showToast('😢 Failed to send inquiry. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error sending contact:', error);
      showToast('😢 An error occurred while sending the inquiry. Please try again.', 'error');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading agency information...</p>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agency Not Found</h2>
          <Link href="/agencies" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
            Back to Agency List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/agencies" className="flex items-center text-red-600 hover:text-red-700">
            <span className="mr-2">←</span>
            Back to Agencies
          </Link>
        </div>

        {/* Agency Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Profile Header with Background */}
          <div className="relative h-40 bg-gradient-to-br from-red-500 via-pink-500 to-orange-500">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          {/* Profile Picture and Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16">
              {/* Profile Picture */}
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden">
                  {agency.image ? (
                    <img 
                      src={agency.image} 
                      alt={agency.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl text-gray-400">🏢</div>
                  )}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              
              {/* Agency Name and Info */}
              <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{agency.name}</h1>
                {agency.tagline && (
                  <p className="text-xl text-gray-600 mb-3">{agency.tagline}</p>
                )}
                
                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start mb-3">
                  <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="text-lg font-medium text-gray-700 ml-2">
                      {agency.rating || 'N/A'}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({agency.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
                <div className="space-y-3">
                  {agency.bio?.gender && (
                    <div className="flex items-center text-gray-700">
                      <span className="w-16 text-sm font-medium text-gray-500">Gender:</span>
                      <span className="text-gray-900">{agency.bio.gender}</span>
                    </div>
                  )}
                  {agency.bio?.age && (
                    <div className="flex items-center text-gray-700">
                      <span className="w-16 text-sm font-medium text-gray-500">Age:</span>
                      <span className="text-gray-900">{agency.bio.age}</span>
                    </div>
                  )}
                  {agency.bio?.hobbies && (
                    <div className="flex items-center text-gray-700">
                      <span className="w-16 text-sm font-medium text-gray-500">Hobbies:</span>
                      <span className="text-gray-900">{agency.bio.hobbies}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                {agency.specialties && agency.specialties.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agency.specialties.map((specialty, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specialty information available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        {agency.services && agency.services.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agency.services.map((service, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Contact Me</h2>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">⭐</span>
              <span className="text-gray-600">
                {agency.rating || 'N/A'} ({agency.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
          
          {!showContactForm ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Send a travel inquiry to {agency.name}!
              </p>
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Send Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    placeholderText="MM/DD/YYYY"
                    dateFormat="MM/dd/yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    placeholderText="MM/DD/YYYY"
                    dateFormat="MM/dd/yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Size
                  </label>
                  <select
                    name="groupSize"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Please select</option>
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3-5">3-5 people</option>
                    <option value="6-10">6-10 people</option>
                    <option value="10+">10+ people</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  placeholder="Please describe your preferred travel style, budget, special requests, and any other details."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Send Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-500 ease-in-out ${
          toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className={`rounded-lg shadow-lg p-4 ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gradient-to-r from-red-500 to-pink-500'
          } text-white`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {toast.type === 'success' ? (
                  <div className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium leading-5">
                  {toast.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => setToast({ show: false, message: '', type: '' })}
                  className="rounded-md inline-flex text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}