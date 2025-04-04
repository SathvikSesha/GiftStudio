async function handler({ query = "", page = 1, limit = 20 }) {
  if (!query) {
    return {
      error: "Search query is required",
      status: 400,
    };
  }

  try {
    const response = await fetch(
      `/integrations/image-search/imagesearch?q=${encodeURIComponent(
        query + " product"
      )}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }

    const data = await response.json();

    if (data.status !== "success" || !data.items) {
      return {
        error: "Invalid response from image service",
        status: 500,
      };
    }

    const optimizedImages = data.items.map((image) => ({
      id: image.contextLink,
      title: image.title,
      thumbnail: image.thumbnailImageUrl,
      fullSize: image.originalImageUrl,
      dimensions: {
        width: image.width,
        height: image.height,
      },
      size: image.size,
    }));

    return {
      images: optimizedImages,
      page,
      limit,
      total: optimizedImages.length,
      status: 200,
    };
  } catch (error) {
    return {
      error: "Failed to process image search",
      status: 500,
    };
  }
}