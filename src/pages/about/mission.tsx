"use client";

import React from "react";
import Image from 'next/image';
import { Layout } from '../../components/layout/Layout';
import { Heart, Globe, Users, Shield, Brain, Clock } from 'lucide-react';

interface FeatureScrollProps {
  direction: "ltr" | "rtl";
  imageSrc: string;
  children: React.ReactNode;
  topPosition?: string;
}

const FeatureScrollContainer: React.FC<FeatureScrollProps> = ({
  direction,
  children,
  imageSrc,
  topPosition = "50%",
}) => {
  const isLTR = direction === "ltr";

  return (
    <div className="w-full">
      <div className="lg:hidden flex flex-col gap-y-10">
        <Image
          src={imageSrc}
          alt="Scrolling"
          width={300}
          height={600}
          className={`w-full max-w-[300px] mx-auto mb-4 ${isLTR ? "order-1" : "order-2"}`}
        />
        <div className={isLTR ? "order-2" : "order-1"}>{children}</div>
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 h-fit w-full justify-center items-start relative">
        <div
          className="sticky flex justify-center items-center"
          style={{ top: topPosition }}
        >
          {children}
        </div>
        <div
          className={`flex items-center justify-center h-fit ${isLTR ? "" : "row-start-1"}`}
        >
          <Image
            src={imageSrc}
            alt="Scrolling"
            width={300}
            height={600}
            className="w-full max-w-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export default function MissionPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-zinc-950">
        {/* Animated Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-zinc-900 mb-6">
                Our Mission
              </h1>
              <p className="text-xl text-zinc-600 mb-8 max-w-4xl mx-auto">
                To make mental health support accessible, compassionate, and available 24/7 to everyone, 
                everywhere. We believe everyone deserves a safe space to process their thoughts, 
                feelings, and experiences without judgment or barriers.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Details with FeatureScroll */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            <FeatureScrollContainer
              topPosition="10%"
              direction="rtl"
              imageSrc="https://cdn.magicui.design/iphone.png"
            >
              <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0 items-center justify-center lg:items-start lg:justify-start text-center lg:text-left">
                <h1 className="text-4xl font-bold text-zinc-900">A Light in the Darkness</h1>
                <p className="text-lg text-zinc-600">
                  Luna was born from a simple yet powerful vision: to create an AI companion that could 
                  provide the kind of compassionate, judgment-free support that everyone deserves, 
                  but that isn't always available when we need it most.
                </p>
                <div className="flex gap-4 w-full">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </FeatureScrollContainer>

            <FeatureScrollContainer
              topPosition="10%"
              direction="ltr"
              imageSrc="https://cdn.magicui.design/iphone.png"
            >
              <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0 items-center justify-center lg:items-start lg:justify-start text-center lg:text-left">
                <h1 className="text-4xl font-bold text-zinc-900">24/7 Availability</h1>
                <p className="text-lg text-zinc-600">
                  We understand that mental health challenges don't follow a schedule. They can strike 
                  at 2 AM, during a busy workday, or when you're far from traditional support systems. 
                  That's why Luna is available 24/7, ready to listen, support, and guide you through 
                  whatever you're experiencing.
                </p>
                <div className="flex gap-4">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                    Start Talking
                  </button>
                  <button className="bg-zinc-100 text-zinc-900 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </FeatureScrollContainer>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-zinc-900 text-center mb-16">
              Our Values
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <Heart className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-zinc-900 mb-4">Compassion</h3>
                <p className="text-zinc-600">
                  Every interaction is guided by empathy and understanding.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <Shield className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-zinc-900 mb-4">Privacy</h3>
                <p className="text-zinc-600">
                  Your thoughts and feelings are protected with the highest security standards.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <Globe className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-zinc-900 mb-4">Accessibility</h3>
                <p className="text-zinc-600">
                  Mental health support available to everyone, everywhere, anytime.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <Brain className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-zinc-900 mb-4">Innovation</h3>
                <p className="text-zinc-600">
                  Continuously improving our AI to provide better, more personalized support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 bg-gradient-to-b from-zinc-50 to-zinc-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-zinc-900 text-center mb-16">
              Our Impact
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-4">1M+</div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">Active Users</h3>
                <p className="text-zinc-600">
                  People worldwide who have found support through Luna
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-500 mb-4">150+</div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">Countries</h3>
                <p className="text-zinc-600">
                  Where Luna is available, breaking down geographical barriers
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-4">24/7</div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">Availability</h3>
                <p className="text-zinc-600">
                  Round-the-clock support when you need it most
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-b from-zinc-100 to-zinc-200">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-zinc-900 mb-6">
              Join Us in Our Mission
            </h2>
            <p className="text-xl text-zinc-600 mb-8">
              Be part of a movement to make mental health support accessible to everyone.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              Start Your Journey
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
} 