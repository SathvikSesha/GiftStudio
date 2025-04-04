"use client";
import React from "react";

function MainComponent() {
  useEffect(() => {
    window.location.href = "/home";
  }, []);

  return null;
}

export default MainComponent;