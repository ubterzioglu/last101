'use client';

import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
}

interface NewsCarouselProps {
  items: NewsItem[];
}

export function NewsCarousel({ items }: NewsCarouselProps) {
  // Duplicate items many times for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <div className="relative">
      {/* Marquee container - full width overflow */}
      <div className="w-screen -ml-[calc((100vw-100%)/2)] overflow-hidden">
        <div className="flex gap-6 animate-marquee-rtl w-max px-4">
          {duplicatedItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Section */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.category && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-google-yellow text-gray-900 text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                )}
              </div>
              
              {/* Text Section */}
              <div className="h-48 p-5 flex flex-col justify-between bg-white">
                <div>
                  <span className="text-xs text-gray-500">{item.date}</span>
                  <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
                <Link 
                  href="#" 
                  className="inline-flex items-center text-sm text-google-blue hover:text-blue-700 font-medium transition-colors mt-2"
                >
                  Devamını Oku →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
