import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using CodeKid ("Service"), you agree to be bound by these Terms of Service 
                ("Terms"). If you do not agree to these Terms, do not use the Service. For users under 18, 
                a parent or legal guardian must accept these Terms on their behalf.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700">
                CodeKid provides an online coding education platform for children ages 5-16, featuring:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>Interactive coding lessons and projects</li>
                <li>AI-powered mentorship and assistance</li>
                <li>Gamified learning with achievements and badges</li>
                <li>Parent monitoring and progress tracking</li>
                <li>Community features (moderated for safety)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.1 Parent Accounts</h3>
              <p className="text-gray-700">
                Parents/guardians must create accounts to enroll children. You must:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">3.2 Student Profiles</h3>
              <p className="text-gray-700">
                Student profiles are managed by parents. Students may not create accounts independently 
                if under 13 years of age, per COPPA regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payment</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">4.1 Free Trial</h3>
              <p className="text-gray-700">
                New users receive a 7-day free trial. No credit card required. Trial includes access 
                to the first 3 lessons of each track.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">4.2 Paid Subscriptions</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Premium ($29/month):</strong> Full access for 1 child</li>
                <li><strong>Family ($49/month):</strong> Full access for up to 4 children</li>
                <li><strong>Lifetime ($999 one-time):</strong> Permanent access for up to 4 children</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">4.3 Billing</h3>
              <p className="text-gray-700">
                Subscriptions auto-renew monthly unless canceled. You will be charged on the same day each 
                month. Prices are subject to change with 30 days notice to existing subscribers.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">4.4 Refunds</h3>
              <p className="text-gray-700">
                14-day money-back guarantee on first subscription. Contact support within 14 days of 
                initial charge for a full refund. Subsequent renewals are non-refundable except as 
                required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
              <p className="text-gray-700 mb-3">You agree NOT to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Share account credentials with others</li>
                <li>Attempt to hack, reverse engineer, or breach security</li>
                <li>Upload malicious code or viruses</li>
                <li>Harass, bully, or threaten other users</li>
                <li>Post inappropriate content (profanity, violence, adult content)</li>
                <li>Scrape or extract data from the platform</li>
                <li>Resell or redistribute our content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content Ownership</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">6.1 Our Content</h3>
              <p className="text-gray-700">
                All lessons, videos, code challenges, and platform materials are owned by CodeKid and 
                protected by copyright. You may not reproduce, distribute, or create derivative works 
                without permission.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">6.2 Student Projects</h3>
              <p className="text-gray-700">
                Students retain ownership of code they create. By using the Service, you grant us a 
                license to host, display, and use student projects for educational purposes and marketing 
                (with parental permission).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Community Guidelines</h2>
              <p className="text-gray-700">
                We maintain a safe, respectful learning environment. Our community features are moderated. 
                Violations may result in warnings, content removal, or account suspension.
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>Be kind and respectful</li>
                <li>Help others learn</li>
                <li>Report inappropriate content</li>
                <li>No sharing personal information (addresses, phone numbers, etc.)</li>
                <li>No external links without approval</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Parental Responsibilities</h2>
              <p className="text-gray-700">
                Parents/guardians are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>Monitoring their child's use of the Service</li>
                <li>Setting appropriate screen time limits</li>
                <li>Reviewing content and progress</li>
                <li>Ensuring their child follows these Terms</li>
                <li>Promptly notifying us of any safety concerns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy and Data</h2>
              <p className="text-gray-700">
                Your use of the Service is also governed by our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>. 
                We are committed to protecting children's privacy and complying with COPPA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers</h2>
              <p className="text-gray-700 mb-3">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Uninterrupted or error-free service</li>
                <li>Specific learning outcomes or employment</li>
                <li>Compatibility with all devices</li>
                <li>Availability of specific features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODEKID SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED 
                THE AMOUNT YOU PAID IN THE PAST 12 MONTHS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">12.1 By You</h3>
              <p className="text-gray-700">
                You may cancel your subscription anytime from account settings. Access continues until 
                the end of your billing period.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">12.2 By Us</h3>
              <p className="text-gray-700">
                We may suspend or terminate accounts that violate these Terms, with or without notice. 
                We reserve the right to refuse service to anyone.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700">
                We may modify these Terms at any time. Material changes will be notified via email or 
                platform notice. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-700">
                These Terms are governed by the laws of [Your State/Country]. Disputes will be resolved 
                in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
              <div className="bg-blue-50 rounded-lg p-6 mt-4">
                <p className="text-gray-900 font-semibold mb-2">CodeKid Support</p>
                <p className="text-gray-700">Email: <a href="mailto:support@codekid.com" className="text-blue-600 hover:underline">support@codekid.com</a></p>
                <p className="text-gray-700">Legal: <a href="mailto:legal@codekid.com" className="text-blue-600 hover:underline">legal@codekid.com</a></p>
                <p className="text-gray-700">Address: [Your Company Address]</p>
              </div>
            </section>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mt-8">
              <p className="text-green-900 font-semibold">
                ✅ By using CodeKid, you agree to these Terms of Service and our commitment to providing 
                a safe, effective learning environment for young coders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
