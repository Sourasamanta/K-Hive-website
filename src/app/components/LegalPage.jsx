"use client";
import React, { useState, useEffect } from "react";
import { Shield, FileText, Calendar, CheckCircle } from "lucide-react";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState("terms");

  // Parse URL to determine initial tab
  useEffect(() => {
    const path = window.location.pathname;
    // Check for both direct routes (/terms, /privacy) and /legal/ routes
    if (path.includes("/privacy") || path.includes("/legal/privacy")) {
      setActiveTab("privacy");
    } else if (path.includes("/terms") || path.includes("/legal/terms")) {
      setActiveTab("terms");
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL without page reload
    const newPath = `/${tab}`;
    window.history.pushState({}, "", newPath);
  };

  return (
    <div className="min-h-screen bg-[#020d17]">
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#1dddf2] to-[#7193ff] rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Legal Information
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#0d1d2c] border border-[#343536] rounded-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => handleTabChange("terms")}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "terms"
                ? "bg-gradient-to-r from-[#1dddf2] to-[#7193ff] text-white shadow-lg"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-[#1a2836]"
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>
          <button
            onClick={() => handleTabChange("privacy")}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "privacy"
                ? "bg-gradient-to-r from-[#1dddf2] to-[#7193ff] text-white shadow-lg"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-[#1a2836]"
            }`}
          >
            <Shield className="w-4 h-4" />
            Privacy Policy
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-[#0d1d2c] border border-[#343536] rounded-lg p-6 md:p-8">
          {activeTab === "terms" && (
            <div className="space-y-6">
              {/* Terms Header */}
              <div className="border-b border-[#343536] pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Terms & Conditions
                </h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: December 15, 2025</span>
                </div>
              </div>

              {/* Introduction */}
              <p className="text-gray-300 leading-relaxed">
                By accessing or using K-Hive, you agree to comply with the following Terms & Conditions. If you do not agree, please refrain from using the platform.
              </p>

              {/* Section 1 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">1.</span> Eligibility
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  K-Hive is intended for students and members of the academic community. By using this platform, you confirm that the information you provide is accurate and truthful.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">2.</span> User Accounts
                </h3>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Authentication is handled via Google Sign-In</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>You are responsible for maintaining the confidentiality of your account</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Any activity performed through your account is your responsibility</span>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">3.</span> User Content
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Users may post content such as:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Questions</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Answers</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Comments</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Media (images, links)</span>
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-3">
                  By posting content on K-Hive, you agree that:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>You own the content or have permission to share it</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Your content does not violate any laws or third-party rights</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>You will not post abusive, hateful, misleading, or harmful content</span>
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-3">
                  K-Hive reserves the right to moderate, edit, or remove content that violates these rules.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">4.</span> Prohibited Activities
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  You agree not to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Spam or flood the platform</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Impersonate others</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Attempt to exploit, hack, or misuse the system</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Post offensive, defamatory, or illegal content</span>
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-3">
                  Violation of these rules may result in temporary or permanent suspension.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">5.</span> Voting & Engagement
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Upvotes and downvotes are meant to promote quality content. Any attempt to manipulate votes or engagement metrics may lead to account restrictions.
                </p>
              </div>

              {/* Section 6 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">6.</span> Termination
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  K-Hive reserves the right to suspend or terminate access to any user who violates these Terms & Conditions, without prior notice.
                </p>
              </div>

              {/* Section 7 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">7.</span> Changes to Terms
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  These terms may be updated periodically. Continued use of the platform implies acceptance of the revised terms.
                </p>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              {/* Privacy Header */}
              <div className="border-b border-[#343536] pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Privacy Policy
                </h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: December 15, 2025</span>
                </div>
              </div>

              {/* Introduction */}
              <p className="text-gray-300 leading-relaxed">
                Your privacy is important to us. This Privacy Policy explains how K-Hive collects, uses, and protects your information.
              </p>

              {/* Section 1 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">1.</span> Information We Collect
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  We may collect:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Basic profile information (name, email, profile picture via Google)</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>User-generated content (posts, comments, interactions)</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Technical data (browser, device type, IP address for security)</span>
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">2.</span> How We Use Your Information
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Your data is used to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Authenticate users</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Display user profiles and content</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Improve platform performance and features</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Maintain security and prevent abuse</span>
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-3">
                  We do not sell or share your personal data with third parties for commercial purposes.
                </p>
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">3.</span> Cookies & Sessions
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  K-Hive uses secure cookies (JWT-based sessions) to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Keep users logged in</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Protect against unauthorized access</span>
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-3">
                  These cookies do not store sensitive personal data in plain text.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">4.</span> Data Security
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  We implement industry-standard security practices, including:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Secure authentication</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Access controls</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Rate limiting and monitoring</span>
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-3">
                  However, no system is 100% secure. Use the platform responsibly.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">5.</span> Third-Party Services
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  K-Hive uses third-party services such as:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Google Authentication</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Media hosting services (for image uploads)</span>
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-3">
                  These services follow their own privacy policies.
                </p>
              </div>

              {/* Section 6 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">6.</span> User Rights
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  You have the right to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>View your profile information</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Request content removal</span>
                  </li>
                  <li className="text-gray-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <span>Delete your account (subject to platform policies)</span>
                  </li>
                </ul>
              </div>

              {/* Section 7 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#1dddf2]">7.</span> Policy Updates
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  This Privacy Policy may be updated occasionally. Continued use of K-Hive indicates acceptance of any changes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}