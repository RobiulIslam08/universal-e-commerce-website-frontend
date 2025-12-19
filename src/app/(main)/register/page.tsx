/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms?: boolean;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();
  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    console.log(data);
    setIsLoading(true);
    try {
      const res = await registerUser(data);

      if (res.success) {
        // ২. সফল হলে টোস্ট দেখানো এবং রিডাইরেক্ট করা
        toast.success(res.message || "Registration Successful!");
        router.push("/");
      } else {
        // যদি API থেকে success: false আসে
        toast.error(res.message || "Registration failed");
      }
    } catch (error: any) {
      // ৩. এরর হলে টোস্ট দেখানো
      console.error(error.message);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity },
    },
  };

  const passwordStrength = password
    ? password.length >= 8
      ? "strong"
      : password.length >= 6
      ? "medium"
      : "weak"
    : "none";

    const handleGoogleLogin = async () => {
        try {
          await signIn("google", {
            callbackUrl: "/", // সফল login এর পর কোথায় redirect করবে
          });
        } catch (error) {
          console.error("Google login error:", error);
          toast.error("Google login failed");
        }
      };
  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-rose-400/10 rounded-full blur-3xl"
          animate={floatingVariants.float}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl"
          animate={{
            ...floatingVariants.float,
            transition: { duration: 4, repeat: Infinity },
          }}
        />
      </div>

      {/* Main container */}
      <motion.div
        className="relative w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-rose-500 to-rose-600 rounded-2xl mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-600 text-sm">
            Join us and start shopping amazing products
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg border border-rose-300 rounded-2xl p-8 shadow-xl"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name field */}
            <motion.div variants={itemVariants}>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-11 border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
              </div>
              {errors.name && (
                <motion.p
                  className="mt-1.5 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name.message}
                </motion.p>
              )}
            </motion.div>

            {/* Email field */}
            <motion.div variants={itemVariants}>
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <motion.p
                  className="mt-1.5 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password field */}
            <motion.div variants={itemVariants}>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10 h-11 border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Password strength indicator */}
              {password && (
                <motion.div
                  className="mt-2 flex gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength === "strong"
                          ? "bg-green-500"
                          : passwordStrength === "medium" && i <= 2
                          ? "bg-yellow-500"
                          : passwordStrength === "weak" && i === 1
                          ? "bg-red-500"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </motion.div>
              )}
              {errors.password && (
                <motion.p
                  className="mt-1.5 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Confirm Password field */}
            <motion.div variants={itemVariants}>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 h-11 border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  className="mt-1.5 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </motion.div>

            {/* Terms checkbox */}
            <motion.div
              className="flex items-start gap-3 pt-1"
              variants={itemVariants}
            >
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-gray-300 bg-white checked:bg-rose-500 accent-rose-500 mt-1"
                {...register("agreeToTerms", {
                  required: "You must agree to the terms and conditions",
                })}
              />
              <label
                htmlFor="terms"
                className="text-xs text-gray-600 leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-rose-600 hover:text-rose-700 underline"
                >
                  terms and conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-rose-600 hover:text-rose-700 underline"
                >
                  privacy policy
                </Link>
              </label>
            </motion.div>
            {errors.agreeToTerms && (
              <motion.p
                className="mt-1.5 text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.agreeToTerms.message}
              </motion.p>
            )}

            {/* Submit button */}
            <motion.div variants={itemVariants} className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-linear-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:from-rose-600 hover:to-rose-700"
              >
                {isLoading ? (
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Creating account...
                  </motion.span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div className="relative my-6" variants={itemVariants}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </motion.div>

          {/* Social signup */}
       <motion.div
            className="grid grid-cols-1 gap-3"
            variants={itemVariants}
          >
            <Button
              onClick={handleGoogleLogin}
              type="button"
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#4285F4"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#34A853"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-xs font-medium">Google</span>
            </Button>
            {/* <Button
              type="button"
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-xs font-medium">Facebook</span>
            </Button>  */}
          </motion.div>
        </motion.div>

        {/* Sign in link */}
        <motion.p
          className="text-center text-sm text-gray-600 mt-6"
          variants={itemVariants}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
