async function handler({ name, phone }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const [updatedUser] = await sql`
      UPDATE auth_users 
      SET name = COALESCE(${name}, name),
          phone = COALESCE(${phone}, phone)
      WHERE id = ${session.user.id}
      RETURNING *
    `;

    return { success: true, user: updatedUser };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}