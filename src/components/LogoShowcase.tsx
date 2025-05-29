
import React from 'react';
import Logo from './Logo';

const LogoShowcase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          {/* Main Logo Display */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Logo size="xl" variant="dark" className="drop-shadow-2xl" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent mb-4">
              CYPHER
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Advanced AI Technology Solutions
            </p>
            <div className="mt-6 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>

          {/* Logo Variations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-green-400/50 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Logo size="lg" variant="dark" />
              </div>
              <h3 className="text-center text-slate-300 font-medium">Primary Logo</h3>
            </div>

            <div className="bg-slate-200/90 backdrop-blur-sm rounded-xl p-6 border border-slate-300 hover:border-green-400/50 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Logo size="lg" variant="light" />
              </div>
              <h3 className="text-center text-slate-600 font-medium">Light Version</h3>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-green-400/50 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Logo size="md" variant="dark" />
              </div>
              <h3 className="text-center text-slate-300 font-medium">Medium Size</h3>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-green-400/50 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Logo size="sm" variant="dark" />
              </div>
              <h3 className="text-center text-slate-300 font-medium">Small Size</h3>
            </div>
          </div>

          {/* Brand Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Header Example */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Header Application</h3>
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center space-x-3">
                  <Logo size="sm" variant="dark" />
                  <span className="text-green-400 font-bold text-lg">CYPHER</span>
                  <div className="flex-1"></div>
                  <div className="flex space-x-4 text-slate-300 text-sm">
                    <span>Products</span>
                    <span>Solutions</span>
                    <span>Contact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Card Example */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Business Card</h3>
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-600 max-w-64">
                <div className="flex items-center space-x-3 mb-4">
                  <Logo size="sm" variant="dark" />
                  <span className="text-green-400 font-bold">CYPHER</span>
                </div>
                <div className="text-slate-300 text-xs space-y-1">
                  <div className="font-medium">John Anderson</div>
                  <div className="text-slate-400">AI Solutions Engineer</div>
                  <div className="text-slate-400">john@cypher.ai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;
