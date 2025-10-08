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
  const [photoPage, setPhotoPage] = useState(0); // Photo gallery pagination
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null); // Photo carousel
  const photosPerPage = 16; // 4x4 grid

  console.log('AgencyDetailPage loaded, params:', params); // 디버깅용

  useEffect(() => {
    console.log('useEffect triggered, params.id:', params.id); // 디버깅용
    if (params.id) {
      console.log('Calling fetchAgency...'); // 디버깅용
      fetchAgency();
    }
  }, [params.id]);

  // 페이지가 포커스될 때마다 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      if (params.id) {
        fetchAgency();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [params.id]);

  // 키보드 네비게이션 (ESC, 좌/우 화살표)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedPhotoIndex !== null && agency?.travelPhotos) {
        if (event.key === 'Escape') {
          setSelectedPhotoIndex(null);
        } else if (event.key === 'ArrowLeft' && selectedPhotoIndex > 0) {
          setSelectedPhotoIndex(selectedPhotoIndex - 1);
        } else if (event.key === 'ArrowRight' && selectedPhotoIndex < agency.travelPhotos.length - 1) {
          setSelectedPhotoIndex(selectedPhotoIndex + 1);
        }
      }
    };

    if (selectedPhotoIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhotoIndex, agency?.travelPhotos]);

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
            {agency.backgroundImage ? (
              <div>
                <img 
                  src={agency.backgroundImage} 
                  alt={`${agency.name} background`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-500 via-pink-500 to-orange-500">
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-50">
                  No background image
                </div>
              </div>
            )}
            
            {/* Rating - Fixed Top Right */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-lg">
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
          
          {/* Profile Picture and Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-8">
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
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 bg-black bg-opacity-50 px-4 py-2 rounded-lg inline-block">{agency.name}</h1>
                  {agency.tagline && (
                    <div className="mt-2">
                      <p className="text-xl text-white bg-black bg-opacity-40 px-3 py-1 rounded-md inline-block">{agency.tagline}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 mt-2">
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

        {/* About Me Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
          
          {agency.aboutMe ? (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {agency.aboutMe}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hello, I'm {agency.name}!</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                I'm passionate about sharing the beauty and culture of Korea with travelers from around the world. 
                With years of experience in tourism, I love creating personalized experiences that showcase 
                Korea's hidden gems, delicious cuisine, and rich traditions. Let me help you discover 
                the Korea that locals know and love!
              </p>
            </div>
          )}
        </div>

        {/* Travel Photo Gallery */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Travel Gallery</h2>
          </div>
          
          <div className="mb-4">
            {/* Photo count and page info */}
            {(() => {
              const allPhotos = [
                ...(agency.travelPhotos || []),
                // Add sample photos for demonstration if less than 8 photos
                ...Array.from({ length: Math.max(0, 8 - (agency.travelPhotos?.length || 0)) }, (_, i) => 
                  `/hero/hero${(i % 4) + 1}.jpg`
                )
              ];
              const totalPhotos = allPhotos.length;
              const totalPages = Math.ceil(totalPhotos / photosPerPage);
              const startPhoto = photoPage * photosPerPage + 1;
              const endPhoto = Math.min((photoPage + 1) * photosPerPage, totalPhotos);
              
              return totalPhotos > 0 && (
                <div className="text-sm text-gray-600">
                  <span>📸 {startPhoto}-{endPhoto} of {totalPhotos} photos</span>
                  {totalPages > 1 && <span className="ml-2">• Page {photoPage + 1} of {totalPages}</span>}
                </div>
              );
            })()}
          </div>
          
          {/* 4x4 Photo Grid */}
          <div className="grid grid-cols-4 gap-3">
            {(() => {
              // 실제 업로드된 사진들만 사용
              const realPhotos = agency.travelPhotos || [];
              
              const startIndex = photoPage * photosPerPage;
              const endIndex = startIndex + photosPerPage;
              const currentPagePhotos = realPhotos.slice(startIndex, endIndex);
              
              // 4x4 그리드를 위해 16개 슬롯 생성
              const photosToShow = Array.from({ length: photosPerPage }, (_, index) => {
                return currentPagePhotos[index] || null;
              });
              
              return photosToShow.map((photo, index) => {
                const globalIndex = startIndex + index;
                return (
                  <div 
                    key={`photo-${photoPage}-${index}`}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative"
                    onClick={() => photo && setSelectedPhotoIndex(globalIndex)}
                  >
                    {photo ? (
                      <>
                        <img 
                          src={photo} 
                          alt={`Travel photo ${globalIndex + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Photo number overlay */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          #{globalIndex + 1}
                        </div>
                        
                        {/* Hover overlay - 검은색 배경 제거 */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white rounded-full p-2 shadow-lg">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Empty placeholder */
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-gray-400 text-center">
                          <div className="text-2xl mb-1">📸</div>
                          <div className="text-xs">Empty</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
          
          {/* Pagination Controls */}
          {(() => {
            const realPhotos = agency.travelPhotos || [];
            const totalPages = Math.ceil(realPhotos.length / photosPerPage);
            
            return totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setPhotoPage(Math.max(0, photoPage - 1))}
                  disabled={photoPage === 0}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    photoPage === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ← Previous
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoPage(i)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        photoPage === i
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setPhotoPage(Math.min(totalPages - 1, photoPage + 1))}
                  disabled={photoPage === totalPages - 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    photoPage === totalPages - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next →
                </button>
              </div>
            );
          })()}
          
          {/* Gallery description */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ✨ These are some of the amazing places I've visited with my travelers! 
              Each photo tells a story of unforgettable Korean experiences.
            </p>
          </div>
        </div>

        {/* Photo Carousel Modal */}
        {selectedPhotoIndex !== null && agency.travelPhotos && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <div 
              className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] border-2 border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Travel Photo {selectedPhotoIndex + 1} of {agency.travelPhotos.length}
                </h3>
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Photo Container */}
              <div className="relative bg-gray-50">
                <img 
                  src={agency.travelPhotos[selectedPhotoIndex]} 
                  alt={`Travel photo ${selectedPhotoIndex + 1}`}
                  className="w-full h-[700px] object-contain"
                />
                
                {/* Previous Button */}
                {selectedPhotoIndex > 0 && (
                  <button
                    onClick={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-95 text-gray-700 p-3 rounded-full hover:bg-opacity-100 transition-all shadow-xl border border-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                {/* Next Button */}
                {selectedPhotoIndex < agency.travelPhotos.length - 1 && (
                  <button
                    onClick={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-95 text-gray-700 p-3 rounded-full hover:bg-opacity-100 transition-all shadow-xl border border-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-gray-50 rounded-b-lg">
                <p className="text-sm text-gray-600 text-center">
                  Shared by <span className="font-medium">{agency.name}</span>
                </p>
                
                {/* Dots indicator */}
                <div className="flex justify-center mt-3 space-x-2">
                  {agency.travelPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedPhotoIndex 
                          ? 'bg-red-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
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