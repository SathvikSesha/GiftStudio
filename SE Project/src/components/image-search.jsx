"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersectable && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
      setImages([]);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!debouncedQuery) {
        setImages([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/pixabay-image-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: debouncedQuery,
            page,
            per_page: 20,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setImages((prev) =>
          page === 1 ? data.images : [...prev, ...data.images],
        );
        setHasMore(data.images.length === 20);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [debouncedQuery, page]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
          className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-8 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500"
        />

        {error && (
          <div className="text-red-500 dark:text-red-400 text-center py-8">
            {error}
          </div>
        )}

        {!error && images.length === 0 && !loading && debouncedQuery && (
          <div className="text-gray-700 dark:text-gray-300 text-center py-8">
            No images found for "{debouncedQuery}"
          </div>
        )}

        {!error && images.length === 0 && !loading && !debouncedQuery && (
          <div className="text-gray-700 dark:text-gray-300 text-center py-8">
            Start typing to search for images
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              ref={index === images.length - 1 ? lastImageRef : null}
              className="relative group cursor-pointer rounded-lg overflow-hidden"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-200 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100">
                <div className="text-white">
                  <p className="font-medium">📸 {image.photographer}</p>
                  <p>❤️ {image.likes}</p>
                </div>
              </div>
            </div>
          ))}

          {loading &&
            [...Array.from({length: 8})].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video"
              />
            ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl w-full">
              <img
                src={selectedImage.largeUrl}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StoryComponent() {
  return (
    <div>
      <MainComponent initialQuery="" />
    </div>
  );
});
}