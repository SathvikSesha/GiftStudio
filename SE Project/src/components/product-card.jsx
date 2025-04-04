"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  product = {
    id: '',
    image_url: "https://ucarecdn.com/05f649bf-b70b-4cf1-921a-c6ac07f433e0/elegant_gift.jpg",
    name: "Gift Item",
    price: 0,
    rating: 4.5,
    stock: 0,
    original_price: null,
    discount: null,
    is_bestseller: false,
    review_count: 0
  }
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUser();

  const addToCart = async () => {
    if (!user) {
      window.location.href = '/account/signin?callbackUrl=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/addToCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: product.id,
          quantity: 1
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("Added to cart!");
      window.dispatchEvent(new CustomEvent('updateCart'));
    } catch (err) {
      toast.error(err.message || "Could not add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="relative">
        <img 
          src={product.image_url || "https://ucarecdn.com/05f649bf-b70b-4cf1-921a-c6ac07f433e0/gift_default.jpg"} 
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />
        {product.is_bestseller && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            Bestseller
          </span>
        )}
      </div>
      <h3 className="mt-2 font-medium text-lg">{product.name}</h3>
      <div className="flex items-center mt-2">
        {[...Array.from({length: 5})].map((_, i) => (
          <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
        <span className="ml-2 text-gray-600">({product.review_count})</span>
      </div>
      <p className="text-xl font-bold mt-2">${product.price?.toFixed(2)}</p>
      <button 
        onClick={addToCart}
        disabled={isLoading}
        className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300 transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </div>
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <MainComponent 
        product={{
          id: '1',
          image_url: "/product1.jpg",
          name: "Premium Wireless Headphones",
          price: 199.99,
          rating: 4.8,
          stock: 10,
          is_bestseller: true,
          review_count: 128
        }}
      />

      <MainComponent 
        product={{
          id: '2',
          image_url: "/product2.jpg",
          name: "Smart Watch Series 5",
          price: 299.99,
          rating: 4.5,
          stock: 3,
          is_bestseller: false,
          review_count: 64
        }}
      />

      <MainComponent 
        product={{
          id: '3',
          image_url: "/product3.jpg",
          name: "Professional Camera Kit",
          price: 899.99,
          rating: 4.9,
          stock: 0,
          is_bestseller: true,
          review_count: 256
        }}
      />

      <MainComponent 
        product={{
          id: '4',
          image_url: "/product4.jpg",
          name: "Laptop Stand",
          price: 29.99,
          rating: 4.3,
          stock: 15,
          is_bestseller: false,
          review_count: 42
        }}
      />
    </div>
  );
});
}