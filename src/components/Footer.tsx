import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 relative">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="h-4 w-4 text-[var(--rooted-secondary)] mr-2" />
              <span className="text-[var(--rooted-primary)] font-semibold">London, UK</span>
            </div>
            <div className="flex items-center mb-4">
              <Phone className="h-4 w-4 text-[var(--rooted-secondary)] mr-2" />
              <span className="text-[var(--rooted-secondary)]">020 7123 4567</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-[var(--rooted-secondary)] mr-2" />
              <span className="text-[var(--rooted-secondary)]">hello@rooted.beauty</span>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-semibold text-[var(--rooted-primary)] mb-4">Socials</h3>
            <div className="space-y-2">
              <a href="#" className="block text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors">LinkedIn</a>
              <a href="#" className="block text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors">Instagram</a>
              <a href="#" className="block text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors">Twitter</a>
              <a href="#" className="block text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors">Facebook</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-[var(--rooted-primary)] mb-4">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors">About us</a>
              <a href="#" className="block text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors">Contact us</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-[var(--rooted-primary)] mb-4">Legal</h3>
            <div className="space-y-2">
              <a href="#" className="block text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors">Data Protection</a>
              <a href="#" className="block text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors">Term of Use</a>
            </div>
          </div>

          {/* Large rooted watermark */}
          <div className="absolute right-0 top-0 text-gray-200 text-9xl font-bold opacity-10 pointer-events-none hidden lg:block">
            rooted
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 pb-8">
          <div className="text-center">
            <p className="text-[var(--rooted-secondary)] text-sm">© 2025 Rooted. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
