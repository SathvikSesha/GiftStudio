async function handler({ script, videoName, replicaId, backgroundUrl }) {
  if (!process.env.TAVUS_API_KEY) {
    return {
      error:
        "Missing Tavus API key. Please configure your environment variables.",
    };
  }

  if (!script || !videoName || !replicaId) {
    return {
      error:
        "Missing required fields. Please provide script, videoName, and replicaId.",
    };
  }

  const payload = {
    script,
    video_name: videoName,
    replica_id: replicaId,
    ...(backgroundUrl && { background_url: backgroundUrl }),
  };

  try {
    const response = await fetch("https://tavusapi.com/v2/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TAVUS_API_KEY,
      },
      body: JSON.stringify(payload),
      timeout: 30000,
    });

    if (!response.ok) {
      if (response.status === 429) {
        return { error: "Rate limit exceeded. Please try again later." };
      }

      if (response.status === 401) {
        return { error: "Invalid API key." };
      }

      return {
        error: `Tavus API error: ${response.status}`,
        details: await response.text(),
      };
    }

    const data = await response.json();

    return {
      success: true,
      video: data,
      hostedUrl: data.hostedUrl,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      return { error: "Request timed out. Please try again." };
    }

    return {
      error: "Failed to connect to Tavus API",
      details: error.message,
    };
  }
}