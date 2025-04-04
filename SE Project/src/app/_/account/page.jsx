"use client";
import React from "react";

function MainComponent() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: user, loading, error } = useUser();
  const { signOut } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [orders, setOrders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await fetch("/api/get-user-orders", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to load orders");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/update-user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="mb-4">Please login to view your account</p>
          <a
            href="/account/signin?callbackUrl=/account"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-center mb-6">
                <img
                  src={user.avatar || "/default-avatar.jpg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-2">
                {["profile", "orders", "settings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i
                      className={`fas fa-${
                        tab === "profile"
                          ? "user"
                          : tab === "orders"
                          ? "shopping-bag"
                          : "cog"
                      } mr-3`}
                    ></i>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                  className="w-full text-left px-4 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                >
                  <i className="fas fa-sign-out-alt mr-3"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === "profile" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Profile Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500 bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Order History</h3>
                  <div className="space-y-4">
                    {ordersLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <i className="fas fa-shopping-bag text-4xl mb-4"></i>
                        <p>No orders found</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="font-bold">Order #{order.id}</h4>
                              <p className="text-gray-600">
                                {new Date(
                                  order.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {item.product_name} x{item.quantity}
                                </span>
                                <span>${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">
                              ${order.total_amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold mb-4">Password</h4>
                      <button className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Change Password
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            defaultChecked
                          />
                          Email notifications for orders
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            defaultChecked
                          />
                          SMS notifications for delivery updates
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Delete Account</h4>
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;