"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ onNavigate }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { data: user, loading } = useUser();

  const handleAccountClick = () => {
    if (user) {
      window.location.href = '/account';
    } else {
      window.location.href = '/login';
    }
  };

  const menuItems = [
    { id: 'ramadan', label: 'Ramadan' },
    {
      id: 'birthday',
      label: 'Birthday',
      dropdown: [
        'For Him',
        'For Her',
        'For Kids',
        'For Parents',
        'For Grandparents'
      ]
    },
    {
      id: 'anniversary',
      label: 'Anniversary',
      dropdown: [
        'Wedding Anniversary',
        'Dating Anniversary',
        'Special Milestones'
      ]
    },
    { id: 'lastMinute', label: 'Last Minute Gifting' },
    { id: 'specialOffers', label: 'Special Offers' },
    {
      id: 'bestSellers',
      label: 'Best Sellers',
      dropdown: [
        'This Week\'s Best',
        'All Time Favorites',
        'Trending Now'
      ]
    },
    { id: 'createHamper', label: 'Create Your Own Hamper' },
    { id: 'gamesGifts', label: 'Games & Unique Gifts' },
    {
      id: 'plantsFlowers',
      label: 'Plants & Flowers',
      dropdown: [
        'Indoor Plants',
        'Outdoor Plants',
        'Fresh Flowers',
        'Artificial Plants'
      ]
    },
    {
      id: 'moreGifts',
      label: 'More Gifts',
      dropdown: [
        'Personalized Gifts',
        'Corporate Gifts',
        'Gift Cards',
        'Luxury Gifts'
      ]
    }
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <ul className="flex items-center flex-1">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="px-3 py-4 text-gray-700 hover:text-blue-600 flex items-center gap-1 text-sm font-medium"
                  onClick={() => onNavigate && onNavigate(item.id)}
                >
                  {item.label}
                  {item.dropdown && (
                    <i className="fas fa-chevron-down text-xs ml-1"></i>
                  )}
                </button>
                
                {item.dropdown && activeDropdown === item.id && (
                  <div className="absolute top-full left-0 bg-white border rounded-lg shadow-lg py-2 w-48 z-50">
                    {item.dropdown.map((subItem, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => onNavigate && onNavigate(`${item.id}-${index}`)}
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button 
            onClick={handleAccountClick}
            className="px-3 py-4 text-gray-700 hover:text-blue-600"
          >
            <i className="fas fa-user text-xl"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}

function StoryComponent() {
  const handleNavigate = (itemId) => {
    console.log('Navigating to:', itemId);
  };

  return (
    <div className="space-y-8">
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">Default Navigation</h2>
        <MainComponent onNavigate={handleNavigate} />
      </div>
    </div>
  );
});
}