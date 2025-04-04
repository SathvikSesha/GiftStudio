"use client";
import React from "react";
import Header from "../components/header";
import MainNav from "../components/main-nav";
import HeroSlider from "../components/hero-slider";

("use client");

function MainComponent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const featuredCategories = [
    {
      title: "Luxury Watches",
      image:
        "https://ucarecdn.com/dfdd31d1-c738-4a08-9464-604c70e45d7d/-/format/auto/",
      link: "/category/watches",
    },
    {
      title: "Jewelry Sets",
      image:
        "https://ucarecdn.com/2b28f5f4-5733-4c24-ac2d-a8ade735bdf4/-/format/auto/",
      link: "/category/jewelry",
    },
    {
      title: "Special Occasions",
      image:
        "https://ucarecdn.com/192c839a-2b5e-41f3-a0a7-facec7eaf5fd/-/format/auto/",
      link: "/category/occasions",
    },
    {
      title: "Baby Gifts",
      image:
        "https://ucarecdn.com/73ab3293-1ea5-4c35-bc8f-f902c9976c8e/-/format/auto/",
      link: "/category/baby",
    },
  ];
  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/search-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          limit: 100,
          sort: "BEST_MATCH",
          query: "",
          bestseller: false,
          isNewArrival: page === 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      const validProducts = data.products.map((product) => {
        let rating = 4.5;
        if (product.product_title?.includes("Crystal")) {
          rating = 4.8 + Math.random() * 0.1;
        } else if (product.product_title?.includes("Anniversary")) {
          rating = 4.8;
        }

        return {
          ...product,
          price: parseFloat(product.offer?.price) || 0,
          rating,
          stock: Math.max(parseInt(product.stock) || 10, 10),
          name: product.product_title || "Gift Item",
          image_url:
            product.product_photos?.[0] ||
            "https://ucarecdn.com/05f649bf-b70b-4cf1-921a-c6ac07f433e0/gift_default.jpg",
          review_count: Math.floor(Math.random() * 500) + 100,
          product_description:
            product.product_description ||
            "Exquisite crystal piece perfect for any special occasion. Features stunning craftsmanship and elegant design.",
          created_at: product.created_at || new Date().toISOString(),
          is_bestseller: [79, 80, 81, 82].includes(parseInt(product.id)),
          category: product.category || "gift",
        };
      });

      if (page === 1) {
        setProducts(validProducts);
      } else {
        setProducts((prev) => [...prev, ...validProducts]);
      }

      setHasMore(data.hasMore);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch("/api/cart-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add",
          productId,
          quantity: 1,
          userId: "guest",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();

      if (data.success) {
        setCartCount(data.itemCount || 0);
        toast.success("Added to cart successfully!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    let timeoutId;
    const attemptFetch = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        if (retryCount < maxRetries) {
          timeoutId = setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, Math.pow(2, retryCount) * 1000);
        }
      }
    };

    attemptFetch();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [page, retryCount]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={cartCount} />
      <MainNav />

      <main className="flex-grow">
        <HeroSlider height="600px" />
        <section className="max-w-7xl mx-auto px-4 md:px-8 my-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Bestsellers</h2>
            <a
              href="/bestsellers"
              className="text-purple-600 hover:text-purple-700"
            >
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard
              key="79"
              product={{
                id: "79",
                name: "Crystal Swan Figurine",
                price: 129.99,
                rating: 4.9,
                stock: 15,
                image_url:
                  "https://ucarecdn.com/d97f3cc6-3b1f-4f64-8814-b1562564b87d/-/format/auto/",
                review_count: 428,
                is_bestseller: true,
                product_description:
                  "Elegant crystal swan figurine with intricate detailing. Perfect for home decor or as a sophisticated gift.",
              }}
              onAddToCart={() => handleAddToCart("79")}
            />
            <ProductCard
              key="80"
              product={{
                id: "80",
                name: "Anniversary Crystal Clock",
                price: 199.99,
                rating: 4.8,
                stock: 12,
                image_url:
                  "https://ucarecdn.com/ef60e08b-cddd-4aaf-813a-92deeee6051b/-/format/auto/",
                review_count: 356,
                is_bestseller: true,
                product_description:
                  "Beautiful crystal clock with anniversary design. A timeless piece for celebrating special moments.",
              }}
              onAddToCart={() => handleAddToCart("80")}
            />
            <ProductCard
              key="81"
              product={{
                id: "81",
                name: "Crystal Vase Collection",
                price: 159.99,
                rating: 4.9,
                stock: 20,
                image_url:
                  "https://ucarecdn.com/b0d57581-715a-49e1-a97e-6baf98e473fa/-/format/auto/",
                review_count: 512,
                is_bestseller: true,
                product_description:
                  "Premium crystal vase collection featuring unique designs. Perfect for displaying flowers or as standalone decor.",
              }}
              onAddToCart={() => handleAddToCart("81")}
            />
            <ProductCard
              key="82"
              product={{
                id: "82",
                name: "Premium Crystal Set",
                price: 249.99,
                rating: 4.9,
                stock: 8,
                image_url:
                  "https://ucarecdn.com/4b9d1a06-6f50-4c5d-a497-8f10d1944c44/-/format/auto/",
                review_count: 289,
                is_bestseller: true,
                product_description:
                  "Luxurious crystal set including wine glasses and decanter. The perfect gift for special occasions.",
              }}
              onAddToCart={() => handleAddToCart("82")}
            />
          </div>
        </section>
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-12 my-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Special Occasions</h2>
                <p className="text-lg mb-6">
                  Find the perfect gift for every celebration
                </p>
                <a
                  href="/occasions"
                  className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Explore Collection
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://ucarecdn.com/61137f9a-9a7f-4f31-985e-570329f901b3/-/format/auto/"
                  alt="Birthday Gifts"
                  className="rounded-lg"
                />
                <img
                  src="https://ucarecdn.com/2b28f5f4-5733-4c24-ac2d-a8ade735bdf4/-/format/auto/"
                  alt="Anniversary Gifts"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-4 md:px-8 my-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <a href="/new" className="text-purple-600 hover:text-purple-700">
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 4)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
              ))}
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-4 md:px-8 my-12">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.map((category, index) => (
              <a
                key={index}
                href={category.link}
                className="relative rounded-xl overflow-hidden group"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end p-4">
                  <h3 className="text-white text-xl font-bold">
                    {category.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-gray-100 py-12 my-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Perfect Gift Ideas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://ucarecdn.com/73ab3293-1ea5-4c35-bc8f-f902c9976c8e/-/format/auto/"
                  alt="Baby Gifts"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Baby Gifts</h3>
                  <p className="text-gray-600 mb-4">
                    Adorable presents for the little ones
                  </p>
                  <a
                    href="/category/baby"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Shop Now →
                  </a>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://ucarecdn.com/99061569-c351-41e6-92c4-6e836f942099/-/format/auto/"
                  alt="Luxury Perfumes"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Luxury Perfumes</h3>
                  <p className="text-gray-600 mb-4">
                    Exclusive fragrances for special moments
                  </p>
                  <a
                    href="/category/perfumes"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Shop Now →
                  </a>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://ucarecdn.com/eabcf73a-505f-442f-8247-256692968ff2/-/format/auto/"
                  alt="Chocolate Gifts"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Chocolate Gifts</h3>
                  <p className="text-gray-600 mb-4">
                    Sweet treats for every occasion
                  </p>
                  <a
                    href="/category/chocolates"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Shop Now →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        companyLinks={[
          { label: "About Us", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "Contact Us", href: "/contact" },
          { label: "Blog", href: "/blog" },
        ]}
        quickLinks={[
          { label: "Shop", href: "/shop" },
          { label: "Cart", href: "/cart" },
          { label: "My Account", href: "/account" },
          { label: "Track Order", href: "/track" },
        ]}
        policyLinks={[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Return Policy", href: "/returns" },
          { label: "Security", href: "/security" },
        ]}
        cities={["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]}
        supportEmail="support@example.com"
        supportPhone="1-800-123-4567"
      />
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        section {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;