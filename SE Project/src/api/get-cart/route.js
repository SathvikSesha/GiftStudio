async function handler(req) {
  const session = getSession();

  console.log("Session:", session);

  if (!session?.user?.id) {
    return {
      status: 401,
      error: "Please sign in to view cart",
    };
  }

  try {
    const cartItems = await sql(
      "SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock FROM cart c JOIN products p ON p.id = c.product_id WHERE c.user_id = $1",
      [session.user.id]
    );

    console.log("Cart items found:", cartItems?.length);

    const total = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    return {
      success: true,
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
    };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return {
      status: 500,
      error: "Failed to fetch cart items",
    };
  }
}