import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to CodeKid ("we," "our," or "us"). We are committed to protecting the privacy 
                and security of our users, especially children. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. COPPA Compliance</h2>
              <p className="text-gray-700">
                CodeKid complies with the Children's Online Privacy Protection Act (COPPA). We do not 
                knowingly collect personal information from children under 13 without verifiable parental 
                consent. Parents must create accounts and manage their children's profiles.
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>Parent/guardian email verification required</li>
                <li>No direct marketing to children</li>
                <li>Parents can review and delete children's data at any time</li>
                <li>No sharing of children's information with third parties for marketing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Parent Information:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Name and email address</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Account credentials</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Student Information:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>First name (no last names required for children)</li>
                <li>Age or date of birth</li>
                <li>Learning progress and achievements</li>
                <li>Code projects and submissions</li>
                <li>AI mentor interactions (for educational improvement only)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Technical Information:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Device and browser information</li>
                <li>IP address (for security and analytics)</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide and improve our educational services</li>
                <li>Personalize learning experiences</li>
                <li>Track student progress and achievements</li>
                <li>Communicate with parents about account and student progress</li>
                <li>Process payments and prevent fraud</li>
                <li>Ensure platform security and safety</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>Encrypted data transmission (SSL/TLS)</li>
                <li>Secure database with row-level security</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Payment processing via PCI-compliant Stripe</li>
                <li>Regular backups and disaster recovery plans</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-3">
                We do NOT sell your personal information. We may share data only in these limited circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> Supabase (hosting), Stripe (payments), OpenRouter (AI services)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>With Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Parental Rights</h2>
              <p className="text-gray-700">
                Parents have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>Review all information collected about their child</li>
                <li>Request deletion of their child's information</li>
                <li>Refuse further collection of their child's information</li>
                <li>Control their child's privacy settings</li>
                <li>Receive notifications about changes to our practices</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@codekid.com" className="text-blue-600 hover:underline">privacy@codekid.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-700">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>Keep you signed in</li>
                <li>Remember preferences</li>
                <li>Analyze usage patterns</li>
                <li>Improve platform performance</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
              <p className="text-gray-700">
                We retain your information for as long as your account is active or as needed to provide services. 
                You may request deletion at any time. Some data may be retained for legal compliance or legitimate 
                business purposes even after account deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Users</h2>
              <p className="text-gray-700">
                Our services are hosted in the United States. By using CodeKid, you consent to the transfer of 
                your information to the U.S. We comply with applicable data protection laws, including GDPR for EU users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy periodically. We will notify you of significant changes via 
                email or prominent notice on our platform. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700">
                If you have questions or concerns about this Privacy Policy:
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mt-4">
                <p className="text-gray-900 font-semibold mb-2">CodeKid Privacy Team</p>
                <p className="text-gray-700">Email: <a href="mailto:privacy@codekid.com" className="text-blue-600 hover:underline">privacy@codekid.com</a></p>
                <p className="text-gray-700">Address: [Your Company Address]</p>
                <p className="text-gray-700">Phone: [Your Contact Number]</p>
              </div>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-8">
              <p className="text-yellow-900 font-semibold">
                🛡️ Your privacy is our priority. We are committed to protecting children's safety online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

