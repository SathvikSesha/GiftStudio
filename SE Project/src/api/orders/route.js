async function handler({ action, userId, cartItems, orderId, status }) {
  if (!action) {
    return { error: "Action is required" };
  }

  switch (action) {
    case "create": {
      if (!userId || !cartItems?.length) {
        return { error: "User ID and cart items are required" };
      }

      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return await sql.transaction(async (txn) => {
        const [order] = await txn(
          "INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id",
          [userId, total, "pending"]
        );

        await txn(
          "INSERT INTO order_items (order_id, product_id, quantity, price) SELECT $1, p.id, c.quantity, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $2",
          [order.id, userId]
        );

        await txn(
          "UPDATE products SET stock = stock - c.quantity FROM cart c WHERE c.product_id = products.id AND c.user_id = $1",
          [userId]
        );

        await txn("DELETE FROM cart WHERE user_id = $1", [userId]);

        return { orderId: order.id };
      });
    }

    case "process": {
      if (!orderId) {
        return { error: "Order ID is required" };
      }

      const [order] = await sql(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, total_amount",
        ["completed", orderId]
      );

      return { order };
    }

    case "update": {
      if (!orderId || !status) {
        return { error: "Order ID and status are required" };
      }

      const [order] = await sql(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status",
        [status, orderId]
      );

      return { order };
    }

    case "history": {
      if (!userId) {
        return { error: "User ID is required" };
      }

      const orders = await sql(
        "SELECT o.id, o.total_amount, o.status, o.created_at, json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name, 'image_url', p.image_url)) as items FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC",
        [userId]
      );

      return { orders };
    }

    default:
      return { error: "Invalid action" };
  }
}