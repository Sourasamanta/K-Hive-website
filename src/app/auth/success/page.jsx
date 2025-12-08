"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function AuthSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Separate effect for redirect
  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-[#020d17] flex items-center justify-center px-4">
      <style jsx>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(29, 221, 242, 0.3),
              0 0 40px rgba(29, 221, 242, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(29, 221, 242, 0.5),
              0 0 60px rgba(29, 221, 242, 0.3);
          }
        }

        .scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }

        .glow {
          animation: glow 2s ease-in-out infinite;
        }

        .delay-1 {
          animation-delay: 0.2s;
        }

        .delay-2 {
          animation-delay: 0.4s;
        }

        .delay-3 {
          animation-delay: 0.6s;
        }
      `}</style>

      <div className="text-center max-w-md w-full">
        {/* Success Message */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 fade-in-up">
          Signed In!
        </h1>

        <p className="text-gray-400 text-md sm:text-lg mb-8 fade-in-up delay-1">
          Welcome to K-Hive
        </p>

        {/* Redirecting Message */}
        <div className="p-6 sm:p-8 fade-in-up delay-2">
          <p className="text-gray-300 text-xs sm:text-base mb-4">
            Redirecting
          </p>
                  {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-8 fade-in-up delay-3">
          <div className="w-2 h-2 bg-[#1dddf2] rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-[#1dddf2] rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#1dddf2] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        </div>
      </div>
    </div>
  );
}