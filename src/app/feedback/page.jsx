"use client";
import React, { useState, useEffect } from "react";
import { Send, CheckCircle, MessageSquare, Lightbulb, Bug, Sparkles, Heart, AlertTriangle } from "lucide-react";
import { useSubmitFeedback } from "@/lib/hooks/useFeedback";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    subject: "",
    feedback: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const { data, isLoading } = useAuth();
  const user = data?.user || null;
  const isLoggedIn = !!user;

  const submitFeedbackMutation = useSubmitFeedback();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast.error("Please login to submit feedback");
      router.push("/");
    }
  }, [isLoading, isLoggedIn, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.feedback) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.feedback.length < 10) {
      toast.error("Feedback must be at least 10 characters long", {
        style: {
          background: "#1a2836",
          color: "#fff",
          border: "1px solid #1dddf2",
        },
      });
      return;
    }

    // Calculate total length including subject
    const totalLength = formData.subject.length + 2 + formData.feedback.length; // +2 for \n\n

    if (totalLength > 2000) {
      toast.error("Combined subject and feedback must not exceed 2000 characters");
      return;
    }

    try {
      // Concatenate subject and feedback with a separator
      const concatenatedContent = `${formData.subject}\n\n${formData.feedback}`;
      
      await submitFeedbackMutation.mutateAsync({
        feedback: concatenatedContent,
      });

      toast.success("Feedback submitted successfully!", {
        style: {
          background: "#1a2836",
          color: "#fff",
          border: "1px solid #1dddf2",
        },
      });
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ subject: "", feedback: "" });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit feedback. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#020d17]">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dddf2]"></div>
        </div>
      )}

      {/* Main Content - Only show if authenticated */}
      {!isLoading && isLoggedIn && (
        <div className="max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#1dddf2] to-[#7193ff] rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                Feedback
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Share your thoughts and help us improve
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Left Side - Information */}
            <div className="space-y-4">
              {/* Welcome Section */}
              <div className="bg-[#0d1d2c] border border-[#343536] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-3">
                  Your Feedback Matters!
                </h2>
                <p className="text-gray-400 text-sm">
                  Whether it's a bug report, feature request, or general comment, we're here to listen and make improvements based on your input.
                </p>
              </div>

              {/* Important Rules */}
              <div className="bg-[#0d1d2c] border border-yellow-900/50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Important Rules
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">Follow Guidelines</h4>
                      <p className="text-gray-400 text-sm">
                        Ensure your feedback complies with our terms and conditions. Review our community guidelines before submitting.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">Be Genuine & Constructive</h4>
                      <p className="text-gray-400 text-sm">
                        Provide honest, constructive feedback. Spam, abusive, or misleading content will not be tolerated.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">Account Monitoring</h4>
                      <p className="text-gray-400 text-sm">
                        All feedback is tracked through authenticated accounts. Unnatural behavior or violations may result in necessary actions being taken.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-[#0d1d2c] border border-[#343536] rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3 text-sm">Privacy Notice</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your privacy is important to us. All feedback is kept confidential and used solely for improving our services.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-[#0d1d2c] border border-[#343536] rounded-lg p-6 h-fit lg:sticky lg:top-6">
              {isSubmitted ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Thank You!
                  </h2>
                  <p className="text-gray-400 text-base">
                    Your feedback has been submitted successfully.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    We appreciate you taking the time to help us improve.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Submit Feedback
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Fill out the form below to share your feedback
                    </p>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-white font-semibold text-sm mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="text-sm w-full px-4 py-3 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1dddf2] focus:border-transparent transition-all"
                      placeholder="What's this about?"
                      disabled={submitFeedbackMutation.isPending}
                    />
                  </div>

                  {/* Feedback Field */}
                  <div>
                    <label className="block text-white font-semibold text-sm mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      rows="10"
                      className="w-full text-sm px-4 py-3 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1dddf2] focus:border-transparent transition-all resize-none"
                      placeholder="Share your thoughts, suggestions, or concerns... (10-2000 characters)"
                      disabled={submitFeedbackMutation.isPending}
                    />
                    <div className="mt-2 text-right">
                      <span className={`text-sm ${
                        (formData.subject.length + formData.feedback.length + 2) > 2000 
                          ? 'text-red-500' 
                          : 'text-gray-500'
                      }`}>
                        {formData.subject.length + formData.feedback.length + 2} / 2000
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitFeedbackMutation.isPending || !formData.subject || !formData.feedback}
                    className="w-full px-4 py-3 bg-[#1dddf2] text-[#020d17] font-bold text-sm rounded-lg hover:bg-[#18b8cc] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                  >
                    {submitFeedbackMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#020d17]"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}