import PageHero from "../components/PageHero/PageHero";

export default function Privacy() {
  return (
    <main>
      <PageHero 
        customTitle="Privacy Policy" 
        customSubtitle="How We Protect and Handle Your Information"
      />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Last Updated */}
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-gray-700">
              This Privacy Policy describes how All About Korea ("we," "our," or "us") collects, 
              uses, and protects your information when you visit our website.
            </p>
          </div>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We Collect</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Account Information:</strong> Name, email address when you create an account</li>
                <li>• <strong>Profile Data:</strong> Any additional information you choose to provide</li>
                <li>• <strong>Communication:</strong> Messages you send through our contact forms</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Automatic Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Usage Data:</strong> Pages visited, time spent, click patterns</li>
                <li>• <strong>Device Information:</strong> Browser type, operating system, IP address</li>
                <li>• <strong>Cookies:</strong> Small files stored on your device for functionality and analytics</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">🔧 Service Provision</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Provide and maintain our services</li>
                  <li>• Process your account registration</li>
                  <li>• Enable user authentication</li>
                  <li>• Deliver personalized content</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">📊 Analytics & Improvement</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Analyze website usage patterns</li>
                  <li>• Improve user experience</li>
                  <li>• Develop new features</li>
                  <li>• Monitor site performance</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">📧 Communication</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Respond to your inquiries</li>
                  <li>• Send service updates</li>
                  <li>• Notify about new content</li>
                  <li>• Provide customer support</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">🛡️ Security & Legal</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Prevent fraud and abuse</li>
                  <li>• Comply with legal obligations</li>
                  <li>• Protect user safety</li>
                  <li>• Enforce our terms of service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Information Sharing</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">🤝 We May Share Information With:</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• <strong>Service Providers:</strong> Third-party companies that help us operate our website (hosting, analytics, etc.)</li>
                <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li>• <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">🚫 We Never:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Sell your personal information to third parties</li>
                <li>• Share your data for marketing purposes without consent</li>
                <li>• Use your information in ways not described in this policy</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights & Choices</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">👀 Access</h4>
                  <p className="text-sm text-gray-600">Request copies of your personal information</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✏️ Correction</h4>
                  <p className="text-sm text-gray-600">Update or correct inaccurate information</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🗑️ Deletion</h4>
                  <p className="text-sm text-gray-600">Request deletion of your personal data</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📤 Portability</h4>
                  <p className="text-sm text-gray-600">Export your data in a structured format</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🛑 Objection</h4>
                  <p className="text-sm text-gray-600">Object to certain data processing</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🍪 Cookies</h4>
                  <p className="text-sm text-gray-600">Control cookie preferences in your browser</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Unauthorized access</li>
                  <li>• Data breaches</li>
                  <li>• Accidental loss</li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li>• Unauthorized disclosure</li>
                  <li>• Data corruption</li>
                  <li>• Malicious attacks</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or want to exercise your rights, please contact us:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-lg">📧</span>
                  <strong>Email:</strong> 
                  <a href="mailto:privacy@allaboutkorea.com" className="ml-2 text-blue-600 hover:text-blue-800">
                    privacy@allaboutkorea.com
                  </a>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-lg">👤</span>
                  <strong>Data Protection Officer:</strong> James Rho
                </div>
                
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-lg">📍</span>
                  <strong>Address:</strong> Daejeon, South Korea & Denver, USA
                </div>
              </div>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Policy Updates</h2>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to 
                review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}