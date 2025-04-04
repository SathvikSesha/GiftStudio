async function handler({ cartId, quantity }) {
  const session = getSession();
  if (!session?.user?.id) {
    return {
      status: 401,
      error: "Please sign in to update cart",
    };
  }

  try {
    if (quantity <= 0) {
      await sql("DELETE FROM cart WHERE id = $1 AND user_id = $2", [
        cartId,
        session.user.id,
      ]);
    } else {
      await sql(
        "UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3",
        [quantity, cartId, session.user.id]
      );
    }

    return {
      status: 200,
      success: true,
    };
  } catch (error) {
    return {
      status: 500,
      error: "Failed to update cart",
    };
  }
}