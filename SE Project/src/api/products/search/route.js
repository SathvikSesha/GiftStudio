async function handler({
  query = "",
  category,
  page = 1,
  minPrice,
  maxPrice,
  sort = "BEST_MATCH",
  condition,
  limit = 20,
  bestseller = false,
  isNewArrival = false,
}) {
  const whereConditions = ["1=1"];
  const values = [];
  let paramCount = 1;

  if (query) {
    whereConditions.push(
      `(LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}) OR LOWER(category) LIKE LOWER($${paramCount}))`
    );
    values.push(`%${query}%`);
    paramCount++;
  }

  if (category) {
    whereConditions.push(`category = $${paramCount}`);
    values.push(category);
    paramCount++;
  }

  if (minPrice) {
    whereConditions.push(`price >= $${paramCount}`);
    values.push(minPrice);
    paramCount++;
  }

  if (maxPrice) {
    whereConditions.push(`price <= $${paramCount}`);
    values.push(maxPrice);
    paramCount++;
  }

  if (bestseller) {
    whereConditions.push("is_bestseller = true");
  }

  if (isNewArrival) {
    whereConditions.push("id IN (82,85,87,89)");
  }

  const offset = (page - 1) * limit;
  let orderClause;

  if (sort === "BEST_MATCH" && query) {
    orderClause =
      "similarity(name, $" +
      paramCount +
      ") + similarity(description, $" +
      paramCount +
      ") DESC, is_bestseller DESC, rating DESC";
    values.push(query);
    paramCount++;
  } else if (sort === "price_asc") {
    orderClause = "price ASC";
  } else if (sort === "price_desc") {
    orderClause = "price DESC";
  } else if (sort === "rating") {
    orderClause = "rating DESC";
  } else {
    orderClause = "is_bestseller DESC, rating DESC";
  }

  const dbQuery = `
    SELECT 
      id,
      name as product_title,
      description as product_description,
      price,
      category,
      image_url,
      stock,
      created_at,
      is_bestseller,
      rating
    FROM products 
    WHERE ${whereConditions.join(" AND ")}
    ORDER BY ${orderClause}
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;
  values.push(limit, offset);

  const [dbProducts, externalResponse] = await Promise.all([
    sql(dbQuery, values),
    bestseller
      ? { data: [] }
      : fetch(
          `/integrations/product-search/search?q=${encodeURIComponent(query)}${
            minPrice ? `&min_price=${minPrice}` : ""
          }${maxPrice ? `&max_price=${maxPrice}` : ""}${
            condition ? `&product_condition=${condition}` : ""
          }&sort_by=${sort}&page=${page}`
        ).then((r) => r.json()),
  ]);

  const formattedDbProducts = dbProducts.map((p) => ({
    product_id: p.id.toString(),
    product_title: p.product_title,
    product_description: p.product_description,
    product_photos: p.image_url ? [p.image_url] : [],
    product_attributes: {
      category: p.category,
      stock: p.stock,
      is_bestseller: p.is_bestseller,
      rating: p.rating,
    },
    offer: {
      price: p.price.toString(),
      product_condition: "NEW",
    },
    source: "database",
  }));

  const externalProducts = (externalResponse?.data || []).map((p) => ({
    ...p,
    source: "external",
  }));

  return {
    products: [...formattedDbProducts, ...externalProducts],
    total: formattedDbProducts.length + externalProducts.length,
    page,
    hasMore:
      externalResponse?.data?.length === 100 ||
      formattedDbProducts.length === limit,
  };
}