import Link from 'next/link';

export default function LoginRequired({ 
  title = "Login Required",
  description = "Please log in to access this content.",
  backLink = "/",
  backText = "← Back to Home",
  benefits = [
    "Access exclusive content",
    "Save your preferences",
    "Connect with the community",
    "Get personalized recommendations"
  ]
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg className="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-4" style={{color: '#B71C1C'}}>
            {title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/login"
              className="w-full block py-3 px-4 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
              style={{backgroundColor: '#B71C1C'}}
            >
              Login to Continue
            </Link>
            
            <Link 
              href="/signup"
              className="w-full block py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Create New Account
            </Link>
            
            <Link 
              href={backLink}
              className="block text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {backText}
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Why do I need to log in?</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
