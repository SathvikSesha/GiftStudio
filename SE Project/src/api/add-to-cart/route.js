async function handler({ product_id, quantity = 1 }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Please sign in to add items to cart" };
  }

  try {
    const [product] = await sql(
      "SELECT id, stock FROM products WHERE id = $1",
      [product_id]
    );

    if (!product) {
      return { error: "Product not found" };
    }

    if (product.stock < quantity) {
      return { error: "Not enough stock available" };
    }

    const [result] = await sql(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3 RETURNING id",
      [session.user.id, product_id, quantity]
    );

    const [countResult] = await sql(
      "SELECT COUNT(*) as count FROM cart WHERE user_id = $1",
      [session.user.id]
    );

    return {
      success: true,
      cartItemId: result.id,
      cartCount: parseInt(countResult.count),
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { error: "Failed to add item to cart" };
  }
}