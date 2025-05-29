'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

const TrustedCompanies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="py-8 bg-transparent border-t border-gray-800">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI solutions..."
              className="w-full bg-black/50 backdrop-blur-sm text-white placeholder-gray-400 rounded-full px-6 py-4 pl-14 border border-gray-800 focus:border-neonTeal-500 focus:outline-none focus:ring-1 focus:ring-neonTeal-500 transition-all duration-200 text-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
