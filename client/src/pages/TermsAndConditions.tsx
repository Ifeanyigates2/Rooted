import { Link } from "wouter";

export default function TermsAndConditions() {
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
          <h1 className="text-3xl font-bold text-[var(--rooted-primary)] mb-8">Terms & Conditions</h1>
          <p className="text-[var(--rooted-secondary)] mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">1. Agreement to Terms</h2>
            <p className="text-[var(--rooted-secondary)] mb-4">
              By accessing and using rooted., you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">2. Account Registration</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>You must be at least 18 years old to create an account</li>
              <li>You must provide accurate, current, and complete information during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>One account per person is permitted</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">3. Service Provider Requirements</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>All service providers must be properly licensed and certified in their respective fields</li>
              <li>Providers must maintain valid professional liability insurance</li>
              <li>Background checks may be required for verification</li>
              <li>Providers must maintain professional standards and conduct</li>
              <li>We reserve the right to suspend accounts that don't meet our verification standards</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">4. Booking & Payment Terms</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>Cancellations must be made at least 24 hours in advance for a full refund</li>
              <li>No-show appointments may result in charges as determined by the service provider</li>
              <li>Payment processing is handled through secure third-party processors</li>
              <li>Refunds are subject to individual provider policies</li>
              <li>Disputes should first be resolved directly with the service provider</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">5. Platform Usage Guidelines</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>No discriminatory language or behavior based on race, ethnicity, religion, gender, or other protected characteristics</li>
              <li>Reviews must be honest and based on actual service experiences</li>
              <li>Harassment, threats, or inappropriate communication is prohibited</li>
              <li>Users may not circumvent the platform for direct bookings to avoid fees</li>
              <li>Commercial solicitation outside of legitimate service offerings is prohibited</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">6. Privacy & Data Protection</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>We collect and use personal information as described in our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
              <li>Location data is used to match you with nearby service providers</li>
              <li>Photos and images you upload may be used for platform promotion with your consent</li>
              <li>We do not sell your personal information to third parties</li>
              <li>You have the right to request deletion of your personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibent text-[var(--rooted-primary)] mb-4">7. Health & Safety</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>Users must disclose any allergies or health conditions relevant to beauty treatments</li>
              <li>Service providers are expected to maintain proper sanitation standards</li>
              <li>Users assume responsibility for their health and safety during treatments</li>
              <li>Emergency contact information should be provided when requested</li>
              <li>Any adverse reactions should be reported immediately to both the provider and platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">8. Liability & Disclaimers</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>rooted. acts as an intermediary platform connecting users with service providers</li>
              <li>We are not responsible for the quality, safety, or outcomes of services provided</li>
              <li>Service providers are independent contractors, not employees of rooted.</li>
              <li>Users engage service providers at their own risk</li>
              <li>Our liability is limited to the maximum extent permitted by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">9. Intellectual Property</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>Users retain ownership of content they create and upload</li>
              <li>By uploading content, you grant rooted. a license to use it for platform operations</li>
              <li>The rooted. brand, logo, and platform design are protected intellectual property</li>
              <li>Users may not copy, modify, or distribute our proprietary content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">10. Termination</h2>
            <ul className="list-disc list-inside text-[var(--rooted-secondary)] space-y-2">
              <li>Either party may terminate this agreement at any time</li>
              <li>We reserve the right to suspend or terminate accounts for violations of these terms</li>
              <li>Upon termination, your right to use the platform ceases immediately</li>
              <li>Data retention and deletion will follow our Privacy Policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">11. Changes to Terms</h2>
            <p className="text-[var(--rooted-secondary)] mb-4">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes, 
              and continued use of the platform constitutes acceptance of updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--rooted-primary)] mb-4">12. Contact Information</h2>
            <p className="text-[var(--rooted-secondary)] mb-4">
              For questions about these Terms & Conditions, please contact us at:
            </p>
            <ul className="list-none text-[var(--rooted-secondary)]">
              <li>Email: legal@rooted.com</li>
              <li>Address: [Your Business Address]</li>
              <li>Phone: [Your Contact Number]</li>
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