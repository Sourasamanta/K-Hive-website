"use client";
import React from "react";
import { Users, Lightbulb, MessageSquare, Sparkles, ExternalLink, Atom, Code, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020d17]">
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#1dddf2] to-[#7193ff] rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              About Us
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Learn more about K-Hive and Kinetex
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* K-Hive Section */}
          <div className="bg-[#0d1d2c] border border-[#343536] rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#1dddf2]/20 to-[#7193ff]/20 border-b border-[#343536] p-6">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-7 h-7 text-[#1dddf2]" />
                <h2 className="text-2xl font-bold text-white">About K-Hive</h2>
              </div>
              <p className="text-gray-400 text-sm">
                A community-driven discussion platform for the KIIT ecosystem
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-300 leading-relaxed">
                K-Hive is a community-driven discussion platform built to connect curious minds, encourage collaboration, and spark meaningful conversations within the KIIT ecosystem.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                Developed by the Web Development Team of Kinetex Society, K-Hive is designed as a central hub where students can ask questions, share ideas, discuss technology, academics, and campus life, and learn from one another in an open and engaging environment.
              </p>

              <p className="text-gray-300 leading-relaxed">
                Our goal is to create a space that feels inclusive, intuitive, and impactful — a place where beginners feel comfortable asking questions and experienced members enjoy sharing knowledge. From thoughtful discussions to constructive feedback, K-Hive aims to promote healthy dialogue and collective growth.
              </p>

              <p className="text-gray-300 leading-relaxed">
                This platform is not just a forum, but a learning experience built by students, for students — continuously evolving through community input and innovation.
              </p>
            </div>
          </div>

          {/* Kinetex Section */}
          <div className="bg-[#0d1d2c] border border-[#343536] rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-[#343536] p-6">
              <div className="flex items-center gap-3 mb-2">
                <Atom className="w-7 h-7 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">About Kinetex</h2>
              </div>
              <p className="text-gray-400 text-sm">
                Advancing quantum computing at KIIT University
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-300 leading-relaxed">
                KINETEX LAB is a student-driven community at KIIT University dedicated to advancing the frontiers of quantum computing. Formed with the vision of nurturing talent in emerging technologies, we aim to make quantum computing accessible and impactful for students and researchers.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                Through workshops, research initiatives, and collaborations with industry experts, we provide hands-on exposure to quantum algorithms, quantum hardware, and real-world applications. Our members engage with cutting-edge tools like Qiskit and Cirq, preparing themselves for the rapidly evolving quantum era.
              </p>
              {/* Visit Button */}
              <div className="mt-6 pt-6 border-t border-[#343536]">
                <button
                  onClick={() => window.open('https://kinetex.in', '_blank')}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Visit Kinetex Website</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}