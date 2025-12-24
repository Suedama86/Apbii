import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
              <span className="font-bold text-xl tracking-tight text-slate-900">App Builder</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium">Features</a>
              <a href="#demo" className="text-slate-600 hover:text-indigo-600 font-medium">Demo</a>
              <a href="#pricing" className="text-slate-600 hover:text-indigo-600 font-medium">Pricing</a>
            </div>
            <button onClick={onStart} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-indigo-200 transform hover:scale-105">
              Launch Builder
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold mb-6 border border-indigo-100">
          <i className="fas fa-bolt mr-2"></i>Patent Pending AI Technology
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
          Create Unlimited <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Mobile Apps</span><br/> in Minutes with AI
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          The World's First 1-Click Mobile App Builder. Turn any website, idea, or keyword into a fully functional iOS & Android app. No coding required.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button onClick={onStart} className="bg-slate-900 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3">
            Start Building for Free <i className="fas fa-arrow-right"></i>
          </button>
          <button className="bg-white text-slate-900 border border-slate-200 text-lg px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
            <i className="fas fa-play"></i> Watch Demo
          </button>
        </div>
        
        {/* Social Proof */}
        <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 font-bold text-xl"><i className="fab fa-apple text-2xl"></i> App Store</div>
          <div className="flex items-center gap-2 font-bold text-xl"><i className="fab fa-google-play text-2xl"></i> Google Play</div>
          <div className="flex items-center gap-2 font-bold text-xl"><i className="fab fa-stripe text-2xl"></i> Stripe</div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why AI App Builder?</h2>
            <p className="text-lg text-slate-600">Join the $935 Billion Mobile App Industry today.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="fa-robot"
              title="AI-Powered Creation"
              desc="Just enter a keyword and our AI builds the entire app structure, writes content, and selects images for you."
              color="text-indigo-600"
              bg="bg-indigo-50"
            />
            <FeatureCard 
              icon="fa-mobile-alt"
              title="iOS & Android Ready"
              desc="Create apps that work perfectly on all devices. Publish directly to Apple App Store and Google Play."
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <FeatureCard 
              icon="fa-bell"
              title="Push Notifications"
              desc="Send unlimited push notifications with 95% open rates. Engage customers instantly."
              color="text-rose-600"
              bg="bg-rose-50"
            />
            <FeatureCard 
              icon="fa-shopping-cart"
              title="E-Com Integration"
              desc="Accept payments via PayPal, Stripe, Square and more. Turn your app into a sales machine."
              color="text-amber-600"
              bg="bg-amber-50"
            />
             <FeatureCard 
              icon="fa-layer-group"
              title="Drag & Drop Editor"
              desc="Customize every pixel with our intuitive drag-and-drop builder. 150+ Professional templates included."
              color="text-blue-600"
              bg="bg-blue-50"
            />
             <FeatureCard 
              icon="fa-chart-line"
              title="Monetization"
              desc="Easily integrate Google AdMob to generate passive income from your free apps."
              color="text-purple-600"
              bg="bg-purple-50"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-indigo-400 mb-2">500+</div>
            <div className="text-slate-400 font-medium">Niches Covered</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-400 mb-2">150+</div>
            <div className="text-slate-400 font-medium">Templates</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-400 mb-2">$935B</div>
            <div className="text-slate-400 font-medium">Market Size</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-400 mb-2">100%</div>
            <div className="text-slate-400 font-medium">Newbie Friendly</div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready To Build Your First App?</h2>
          <p className="text-indigo-100 text-xl mb-10">Don't miss the mobile revolution. Start creating profitable apps in seconds.</p>
          <button onClick={onStart} className="bg-white text-indigo-600 text-xl px-10 py-4 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-2xl transform hover:-translate-y-1">
            Get Started Now
          </button>
          <p className="mt-6 text-sm text-indigo-200 opacity-80">30 Day Money Back Guarantee • No Credit Card Required</p>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color, bg }: any) => (
  <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
    <div className={`w-14 h-14 ${bg} ${color} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);
