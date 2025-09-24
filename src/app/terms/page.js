import PageHero from "../components/PageHero/PageHero";

export default function Terms() {
  return (
    <main>
      <PageHero 
        customTitle="Terms of Service" 
        customSubtitle="Rules and Guidelines for Using All About Korea"
      />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Last Updated */}
          <div className="bg-gray-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-gray-700">
              Welcome to All About Korea! These Terms of Service (&quot;Terms&quot;) govern your use of our website 
              and services. By accessing or using our site, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Agreement to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Agreement to Terms</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                By accessing and using All About Korea, you accept and agree to be bound by the terms and 
                provision of this agreement. Additionally, when using this website&apos;s particular services, 
                you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
              <div className="bg-white border border-blue-300 rounded p-4">
                <p className="text-sm text-blue-800 font-semibold">
                  ⚠️ If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </div>
          </section>

          {/* Use License */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Use License</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">✅ You May:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• View and read content for personal use</li>
                  <li>• Share links to our articles on social media</li>
                  <li>• Create an account and participate in discussions</li>
                  <li>• Contact us with feedback or questions</li>
                  <li>• Use our content for educational purposes</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">❌ You May Not:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Copy or redistribute our content commercially</li>
                  <li>• Use automated systems to access our site</li>
                  <li>• Attempt to hack or disrupt our services</li>
                  <li>• Post spam, malicious, or illegal content</li>
                  <li>• Impersonate other users or entities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">User Accounts</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Creation</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• You must provide accurate and complete information when creating an account</li>
                  <li>• You are responsible for maintaining the security of your account</li>
                  <li>• You must notify us immediately of any unauthorized use</li>
                  <li>• One person may not maintain multiple accounts</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Termination</h3>
                <p className="text-gray-700 mb-3">
                  We reserve the right to terminate or suspend accounts that violate these terms, including:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Posting inappropriate or offensive content</li>
                  <li>• Spamming or harassment of other users</li>
                  <li>• Attempting to circumvent site security</li>
                  <li>• Commercial use without permission</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content Guidelines */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Content Guidelines</h2>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">📝 User-Generated Content</h3>
              <p className="text-gray-700 mb-4">
                When you post content on All About Korea, you grant us a non-exclusive, royalty-free license 
                to use, display, and distribute that content on our platform.
              </p>
              <div className="bg-white border border-purple-300 rounded p-4">
                <p className="text-sm text-purple-800">
                  You retain ownership of your content but allow us to use it to operate our service.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">🚫 Prohibited Content:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Hate speech or discriminatory content</li>
                  <li>• Violent or graphic material</li>
                  <li>• Copyright infringing content</li>
                  <li>• Personal information of others</li>
                  <li>• Misleading or false information</li>
                  <li>• Commercial advertisements</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">✨ Encouraged Content:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Thoughtful discussions about Korean culture</li>
                  <li>• Personal experiences and reviews</li>
                  <li>• Constructive feedback and suggestions</li>
                  <li>• Questions and helpful answers</li>
                  <li>• Respectful cultural exchange</li>
                  <li>• Original photos and stories</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">🔒 Our Content</h3>
              <p className="text-gray-700 mb-4">
                All content on All About Korea, including text, graphics, logos, images, and software, 
                is the property of All About Korea or its content suppliers and is protected by copyright laws.
              </p>
              
              <div className="bg-white border border-orange-300 rounded p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Fair Use Policy:</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• You may quote small portions with proper attribution</li>
                  <li>• Links to our content are always welcome</li>
                  <li>• Contact us for permission for larger uses</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Disclaimers</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Information Accuracy</h3>
                <p className="text-gray-700 text-sm">
                  While we strive for accuracy, the information on All About Korea is provided &quot;as is&quot; 
                  without warranty. Cultural information, restaurant recommendations, and travel advice 
                  may change over time.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">🔗 External Links</h3>
                <p className="text-gray-700 text-sm">
                  Our website may contain links to external sites. We are not responsible for the 
                  content, privacy policies, or practices of these third-party websites.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">💼 Professional Advice</h3>
                <p className="text-gray-700 text-sm">
                  Content on our site is for informational purposes only and should not be considered 
                  as professional travel, legal, or financial advice.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">🛡️ Limitation of Liability</h3>
                <p className="text-gray-700 text-sm">
                  All About Korea shall not be liable for any damages arising from the use of 
                  this website or reliance on its content.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Privacy</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the website, to understand our practices.
              </p>
              <a 
                href="/privacy" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
              >
                📄 Read our Privacy Policy
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms of Service at any time. Changes will be 
                effective immediately upon posting on this page. Your continued use of the website 
                after changes constitutes acceptance of the new terms.
              </p>
              <div className="bg-white border border-red-300 rounded p-4">
                <p className="text-sm text-red-800 font-semibold">
                  💡 We recommend checking this page periodically for updates.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-lg">📧</span>
                  <strong>Email:</strong> 
                  <a href="mailto:legal@allaboutkorea.com" className="ml-2 text-blue-600 hover:text-blue-800">
                    legal@allaboutkorea.com
                  </a>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-lg">👤</span>
                  <strong>Legal Contact:</strong> James Rho
                </div>
                
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-lg">🌐</span>
                  <strong>Website:</strong> All About Korea
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}