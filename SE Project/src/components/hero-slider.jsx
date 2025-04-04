"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  height = "500px",
  showArrows = true,
  onGiftClick
}) {
  return (
    <div className="relative overflow-hidden bg-[#1a237e]" style={{ height }}>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10">
          <i className="fas fa-star text-[#ffd700] text-2xl"></i>
        </div>
        <div className="absolute top-20 right-20">
          <i className="fas fa-star text-[#ffd700] text-xl"></i>
        </div>
        <div className="absolute bottom-20 left-20">
          <i className="fas fa-star text-[#ffd700] text-xl"></i>
        </div>
        <div className="absolute top-1/4 left-1/4">
          <i className="fas fa-lantern text-[#ffd700] text-4xl animate-bounce"></i>
        </div>
        <div className="absolute top-1/3 right-1/4">
          <i className="fas fa-lantern text-[#ffd700] text-4xl animate-bounce delay-100"></i>
        </div>
      </div>

      <div className="relative h-full flex items-center justify-center">
        <div className="flex items-center gap-12">
          <div className="relative">
            <div className="w-[300px] h-[300px] bg-[#4051b5] rounded-lg shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16">
                <i className="fas fa-moon text-[#ffd700] text-4xl"></i>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <i className="fas fa-gift text-[#ffd700] text-8xl"></i>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-[#ffd700] text-5xl font-bold mb-6">
              This Eid, brighten their night with love
            </h2>
            <button
              onClick={onGiftClick}
              className="inline-block bg-[#ffd700] text-[#1a237e] px-12 py-4 rounded-full text-xl font-bold hover:bg-[#ffeb3b] transition-colors"
            >
              GIFT NOW
            </button>
          </div>
        </div>
      </div>

      {showArrows && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#ffd700] hover:bg-[#ffeb3b] rounded-full p-4 text-[#1a237e] transition-all"
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left text-2xl"></i>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#ffd700] hover:bg-[#ffeb3b] rounded-full p-4 text-[#1a237e] transition-all"
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right text-2xl"></i>
          </button>
        </>
      )}

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        .delay-100 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Eid Hero Banner</h3>
        <MainComponent 
          onGiftClick={() => console.log('Gift button clicked')}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Eid Hero Banner without Arrows</h3>
        <MainComponent 
          showArrows={false}
          height="400px"
          onGiftClick={() => console.log('Gift button clicked')}
        />
      </div>
    </div>
  );
});
}