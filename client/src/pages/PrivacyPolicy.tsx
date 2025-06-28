import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200">
        <Link href="/">
          <h1 className="text-2xl font-bold text-[var(--rooted-primary)] cursor-pointer">rooted.</h1>
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-[var(--rooted-primary)] mb-8">Privacy Policy</h1>
          <p className="text-[var(--rooted-secondary)] mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">1. Information We Collect</h2>
            <h3 className="text-lg font-medium text-[var(--rooted-primary)] mb-2">Personal Information</h3>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2 mb-4">
              <li>Name, email address, and phone number</li>
              <li>Profile photos and service portfolio images</li>
              <li>Location information for service matching</li>
              <li>Payment information (processed securely by third parties)</li>
              <li>Identity verification documents for service providers</li>
            </ul>
            
            <h3 className="text-lg font-medium text-[var(--rooted-primary)] mb-2">Usage Information</h3>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>Service searches and booking history</li>
              <li>Reviews and ratings</li>
              <li>Communication with service providers</li>
              <li>Device information and IP address</li>
              <li>App usage patterns and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>Match you with relevant beauty service providers</li>
              <li>Process bookings and payments</li>
              <li>Verify service provider credentials and backgrounds</li>
              <li>Send booking confirmations and service reminders</li>
              <li>Improve our platform and user experience</li>
              <li>Prevent fraud and ensure platform safety</li>
              <li>Send promotional content (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">3. Information Sharing</h2>
            <h3 className="text-lg font-medium text-[var(--rooted-primary)] mb-2">With Service Providers</h3>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2 mb-4">
              <li>Contact information for booking confirmations</li>
              <li>Service preferences and special requirements</li>
              <li>Location information for appointment logistics</li>
            </ul>
            
            <h3 className="text-lg font-medium text-[var(--rooted-primary)] mb-2">With Third Parties</h3>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2 mb-4">
              <li>Payment processors for transaction handling</li>
              <li>Background check services for provider verification</li>
              <li>Analytics services for platform improvement</li>
              <li>Customer support tools</li>
            </ul>
            
            <p className="text-[var(--rooted-secondary)]">
              <strong>We never sell your personal information to third parties.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">4. Data Security</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>All data is encrypted in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information on a need-to-know basis</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Regular backups with encrypted storage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">5. Your Rights and Choices</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Update:</strong> Modify your profile and preferences at any time</li>
              <li><strong>Delete:</strong> Request deletion of your account and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
              <li><strong>Restrict:</strong> Limit how we process your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">6. Location Information</h2>
            <p className="text-[var(--rooted-secondary)] mb-4">
              We use your location to match you with nearby service providers and improve search results. 
              You can control location sharing through your device settings or app preferences.
            </p>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>Precise location for accurate provider matching</li>
              <li>General area information for search optimization</li>
              <li>Travel distance calculations for convenience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">7. Children's Privacy</h2>
            <p className="text-[var(--rooted-secondary)]">
              Our platform is not intended for children under 18. We do not knowingly collect personal 
              information from children under 18. If we become aware that we have collected such information, 
              we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">8. Data Retention</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>Account information: Until account deletion or 3 years of inactivity</li>
              <li>Booking history: 7 years for business and legal purposes</li>
              <li>Payment information: As required by payment processors and law</li>
              <li>Communication records: 2 years for customer support purposes</li>
              <li>Analytics data: Aggregated and anonymized, retained indefinitely</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">9. International Data Transfers</h2>
            <p className="text-[var(--rooted-secondary)]">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your privacy and rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">10. Changes to This Policy</h2>
            <p className="text-[var(--rooted-secondary)]">
              We may update this Privacy Policy periodically. We will notify you of significant changes 
              via email or through the app. Your continued use of our services constitutes acceptance 
              of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">11. Contact Us</h2>
            <p className="text-[var(--rooted-secondary)] mb-4">
              For questions about this Privacy Policy or to exercise your rights, contact us:
            </p>
            <ul className="list-none text-[var(--rooted-secondary)]">
              <li>Email: privacy@rooted.com</li>
              <li>Address: [Your Business Address]</li>
              <li>Phone: [Your Contact Number]</li>
              <li>Data Protection Officer: [DPO Contact if applicable]</li>
            </ul>
          </section>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}