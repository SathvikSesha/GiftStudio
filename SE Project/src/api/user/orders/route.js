async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const orders = await sql`
    SELECT o.*, 
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ${session.user.id}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  return { orders };
}