"use client";
import React from "react";

("use client");

function MainComponent() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: user } = useUser();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cart-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "get",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch cart items");
      }

      setCartItems(data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.message || "Could not load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch("/api/cart-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          productId: id,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      await fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Could not update quantity. Please try again.");
    }
  };
  const removeItem = async (id) => {
    try {
      const response = await fetch("/api/cart-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "remove",
          productId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Could not remove item. Please try again.");
    }
  };
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 29.99;
  const total = subtotal + tax + shipping;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Please sign in to view your cart
          </h2>
          <a
            href="/account/signin?callbackUrl=/cart"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <i className="fas fa-spinner fa-spin text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Loading your cart...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{error}</h2>
          <button
            onClick={fetchCartItems}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                  >
                    <i className="fas fa-minus text-sm"></i>
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                  >
                    <i className="fas fa-plus text-sm"></i>
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-96 bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <a
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <i className="fas fa-lock"></i>
              Proceed to Checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;