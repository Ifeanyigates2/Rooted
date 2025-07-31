import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
 
export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
 
  useEffect(() => {
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setLocation("/signup");
    }
  }, [setLocation]);

  const handleVerify = () => {
    if (otpValue.length === 4) {
      alert("Email verified successfully!");
      localStorage.removeItem("verificationEmail");
      setLocation("/complete-profile");
    }
  };

  const handleResendCode = () => {
    alert("Code resent to your email!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 4-digit code to <span className="font-semibold">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter verification code
              </label>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                maxLength={4}
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={otpValue.length !== 4}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-lg"
            >
              Verify ✨
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendCode}
                className="text-gray-900 hover:underline font-medium"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}