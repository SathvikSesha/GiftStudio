"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const [cartCount, setCartCount] = useState(0);
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCartUpdate = (event) => {
      setCartCount(event.detail.count);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    if (user) {
      fetch('/api/cart-operations', {
        method: 'POST',
        body: JSON.stringify({ action: 'get' })
      })
        .then(res => res.json())
        .then(data => {
          if (data.itemCount) {
            setCartCount(data.itemCount);
          }
        })
        .catch(console.error);
    }

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  const handleLocationSearch = async (input) => {
    try {
      const response = await fetch(`/integrations/google-place-autocomplete/autocomplete/json?input=${input}&radius=500`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data = await response.json();
      setLocationSuggestions(data.predictions);
      setShowLocationDropdown(true);
    } catch (err) {
      setError('Could not load locations');
      console.error(err);
    }
  };

  const selectLocation = (location) => {
    setLocation(location.description);
    setShowLocationDropdown(false);
  };

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#121212] text-white flex items-center justify-center font-bold">
            G
          </div>
          <span className="text-xl font-bold">THE GIFT STUDIO</span>
        </a>

        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-lg bg-[#FDF5E6] focus:outline-none"
            />
            <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLocationDropdown(true)}>
              <i className="fas fa-map-marker-alt text-gray-700"></i>
              <input
                type="text"
                placeholder="Select Location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  handleLocationSearch(e.target.value);
                }}
                className="w-40 bg-transparent border-none focus:outline-none"
              />
            </div>
            {showLocationDropdown && locationSuggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
                {locationSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectLocation(suggestion)}
                  >
                    {suggestion.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              <a href="/cart" className="relative">
                <i className="fas fa-shopping-cart text-xl"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
              <a href="/account" className="text-gray-600 hover:text-gray-900">Account</a>
              <a href="/account/logout" className="text-gray-600 hover:text-gray-900">Logout</a>
            </>
          ) : (
            <>
              <a href="/account/signin" className="text-gray-600 hover:text-gray-900">Sign In</a>
              <a href="/account/signup" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Sign Up</a>
            </>
          )}

          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Bulk/Corporate Enquiry
          </button>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </header>
  );
}

function StoryComponent() {
  return (
    <div className="space-y-8">
      <MainComponent />
    </div>
  );
});
}