"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Reset link sent to your email!");
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />

      <motion.div
        className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-rose-200 rounded-2xl p-8 shadow-xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-sm">
            No worries! Enter your email and we&apos;ll send you reset instructions.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11 border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-lg transition-all"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">
              If an account exists for <strong>{email}</strong>, you will
              receive a password reset link shortly.
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              Try another email
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
