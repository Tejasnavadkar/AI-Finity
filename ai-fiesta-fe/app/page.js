import React from 'react';
import Link from 'next/link';

const AIFiestaLanding = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 "//inset-0 meanse takes full height width
        style={{// here First gradient → horizontal lines and 2nd gradient gives vertical lines
          backgroundImage: `
            linear-gradient(gray 1px, transparent 1px), 
            linear-gradient(90deg, gray 1px, transparent 1px) 
          `,
          backgroundSize: '80px 80px' //box size 
        }}
      />
      
      {/* Green Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div> {/* bg-emerald-500/10 → halka green color with 10% opacity., blur-3xl → spread-out glow look. */}
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
          </div>
          <span className="text-white text-xl font-bold">AI Fiesta</span>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-6 bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/50">
            <button className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">Features</button>
            <button className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">Pricing</button>
            <button className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">FAQs</button>
          </div>
          
          <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 text-sm font-medium flex items-center space-x-2">
            <span>Log In</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Y Combinator Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 text-amber-400 text-sm font-medium">
              <span>Built by Y Combinator Alumni</span>
            </div>

            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
                World's Most{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                  Powerful AIs
                </span>
                .{' '}
                <span className="text-white">One Chat.</span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Stop juggling tabs and subscriptions - AI Fiesta gives you access to 
                all best-in-class AI models for just $12/month. That's almost half of 
                what you'd pay for a single premium AI chat subscription.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col gap-2 ">
              <Link href="/ChatPage">
                <button className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 flex items-center space-x-3">
                  <span className="text-lg">Get Started Now</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
              
              <p className="text-gray-400 text-sm">
                Experience smarter & more accurate answers  
              </p>
            </div>
          </div>

          {/* Right Content - YouTube Video */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-2 shadow-2xl border border-gray-700/50">
              {/* Video Container */}
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-inner">
                <iframe
                  src="https://www.youtube.com/embed/yMVNJzdvLi4?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&playlist=yMVNJzdvLi4"
                  title="AI Fiesta Demo"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
                
                {/* Video Overlay for Premium Feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-teal-500 rounded-full blur-sm animate-pulse delay-1000"></div>
            </div>
            
            {/* Floating Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl scale-110 -z-10"></div>
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
      <div className="absolute top-3/4 right-20 w-1 h-1 bg-teal-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-40 delay-500"></div>
    </div>
  );
};

export default AIFiestaLanding;




// linear-gradient(gray 1px, transparent 1px) → horizontal line banata hai.

// linear-gradient(90deg, gray 1px, transparent 1px) → vertical line banata hai. 90deg → left to right. vertically

// background-size: 80px 80px; → dono gradients ko repeat karke ek grid pattern banata hai.

// opacity-20 → halka gray look deta hai, zyada bold nahi.