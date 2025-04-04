async function handler({ query, page = 1, per_page = 20 }) {
  if (!query) {
    return {
      error: "Search query is required",
    };
  }

  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    return {
      error: "Pixabay API key is not configured",
    };
  }

  const baseUrl = "https://pixabay.com/api/";
  const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(
    query
  )}&page=${page}&per_page=${per_page}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        error: "Failed to fetch images from Pixabay",
      };
    }

    const data = await response.json();

    const images = data.hits.map((img) => ({
      id: img.id,
      url: img.webformatURL,
      largeUrl: img.largeImageURL,
      thumbnail: img.previewURL,
      title: img.tags,
      photographer: img.user,
      width: img.webformatWidth,
      height: img.webformatHeight,
      likes: img.likes,
      downloads: img.downloads,
    }));

    return {
      images,
      total: data.total,
      totalHits: data.totalHits,
      currentPage: page,
    };
  } catch (error) {
    return {
      error: "Failed to process image search",
    };
  }
}