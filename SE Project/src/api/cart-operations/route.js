async function handler({ action, productId, quantity = 1 }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Please sign in to add items to cart" };
  }

  const userId = session.user.id;

  try {
    switch (action) {
      case "get": {
        const cartItems = await sql(
          "SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1",
          [userId]
        );
        const total = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        return {
          items: cartItems,
          total,
          itemCount: cartItems.length,
        };
      }

      case "add": {
        if (!productId) {
          return { error: "Product ID is required" };
        }

        const products = await sql(
          "SELECT id, stock FROM products WHERE id = $1",
          [productId]
        );

        if (!products.length) {
          return { error: "Product not found" };
        }

        const product = products[0];
        if (product.stock < quantity) {
          return { error: "Not enough stock available" };
        }

        const existingItems = await sql(
          "SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2",
          [userId, productId]
        );

        let result;
        if (existingItems.length) {
          const newQuantity = existingItems[0].quantity + quantity;
          if (newQuantity > product.stock) {
            return { error: "Cannot add more items than available in stock" };
          }
          result = await sql(
            "UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *",
            [newQuantity, existingItems[0].id]
          );
        } else {
          result = await sql(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
            [userId, productId, quantity]
          );
        }

        const cartCount = await sql(
          "SELECT SUM(quantity) as count FROM cart WHERE user_id = $1",
          [userId]
        );

        return {
          success: true,
          cart_item: result[0],
          itemCount: cartCount[0].count || 0,
        };
      }

      case "remove": {
        if (!productId) {
          return { error: "Product ID is required" };
        }
        await sql("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [
          userId,
          productId,
        ]);
        break;
      }

      case "update": {
        if (!productId) {
          return { error: "Product ID is required" };
        }

        if (quantity > 0) {
          const products = await sql(
            "SELECT id, stock FROM products WHERE id = $1",
            [productId]
          );

          if (!products.length) {
            return { error: "Product not found" };
          }

          if (products[0].stock < quantity) {
            return { error: "Not enough stock available" };
          }

          await sql(
            "UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
            [quantity, userId, productId]
          );
        } else {
          await sql("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [
            userId,
            productId,
          ]);
        }
        break;
      }

      case "clear": {
        await sql("DELETE FROM cart WHERE user_id = $1", [userId]);
        break;
      }

      default:
        return { error: "Invalid action" };
    }

    const cartItems = await sql(
      "SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1",
      [userId]
    );
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      items: cartItems,
      total,
      itemCount: cartItems.length,
    };
  } catch (error) {
    console.error("Cart operation error:", error);
    return {
      error: error.message || "An error occurred during cart operation",
    };
  }
}