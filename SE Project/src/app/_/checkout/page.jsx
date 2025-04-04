"use client";
import React from "react";

function MainComponent() {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const demoOrder = {
    items: [
      { id: 1, name: "Wireless Headphones", price: 199.99, quantity: 1 },
      { id: 2, name: "Smart Watch", price: 299.99, quantity: 2 },
    ],
    subtotal: 799.97,
    shipping: 9.99,
    tax: 64.0,
    total: 873.96,
  };

  const fetchAddressSuggestions = async (input) => {
    try {
      const response = await fetch(
        `/integrations/google-place-autocomplete/autocomplete/json?input=${encodeURIComponent(
          input
        )}&radius=500`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch address suggestions");
      }
      const data = await response.json();
      setSuggestions(data.predictions);
    } catch (err) {
      console.error(err);
      setError("Couldn't load address suggestions");
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    if (value.length > 2) {
      fetchAddressSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      window.location.href = "/order-confirmation";
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">Delivery Address</h2>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={address}
                onChange={handleAddressChange}
                placeholder="Start typing your address..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      onClick={() => {
                        setSelectedAddress(suggestion);
                        setAddress(suggestion.description);
                        setSuggestions([]);
                      }}
                      className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                    >
                      {suggestion.description}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-6">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={paymentMethod === "credit"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-blue-600"
                />
                <span className="ml-3">
                  <i className="fas fa-credit-card mr-2"></i>
                  Credit Card
                </span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-blue-600"
                />
                <span className="ml-3">
                  <i className="fab fa-paypal mr-2"></i>
                  PayPal
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {demoOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">
                    ${demoOrder.subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">
                    ${demoOrder.shipping.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax</p>
                  <p className="font-medium">${demoOrder.tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <p className="font-semibold">Total</p>
                  <p className="font-semibold">${demoOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-medium ${
                loading || !selectedAddress
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;