"use client";

import React, { createContext, useContext } from "react";
import { useBlogMetrics } from "@/hooks/useBlogMetrics";

const MetricsContext = createContext(null);

export const BlogMetricsProvider = ({ id, initialLikes, initialViews, children }) => {
  const metrics = useBlogMetrics(id, initialLikes, initialViews);

  return (
    <MetricsContext.Provider value={metrics}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("useMetrics must be used within a BlogMetricsProvider");
  }
  return context;
};
