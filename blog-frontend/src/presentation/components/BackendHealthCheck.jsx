"use client";

import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://blog-microservice.neuralcook.workers.dev";

export default function BackendHealthCheck() {
  const isChecking = useRef(false);

  useEffect(() => {
    if (isChecking.current) return;
    isChecking.current = true;

    const TOAST_ID = "backend-health-toast";
    let isWaiting = false;
    let pollInterval;

    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
        if (res.ok) {
          // Backend is up!
          if (isWaiting) {
            toast.success("Backend server is ready!", { id: TOAST_ID });
            isWaiting = false;
          }
          clearInterval(pollInterval);
        } else {
          throw new Error("Backend not ready");
        }
      } catch (err) {
        // Still waiting
        if (!isWaiting) {
          isWaiting = true;
          // Add a small delay so it doesn't flash if the backend is actually fast/up
          setTimeout(() => {
            if (isWaiting && isChecking.current) {
              toast.loading("Waiting for backend server to start, give it a min...", { 
                duration: Infinity,
                id: TOAST_ID 
              });
            }
          }, 1000);
        }
      }
    };

    // Check immediately
    checkHealth();

    // Poll every 5 seconds
    pollInterval = setInterval(checkHealth, 5000);

    return () => {
      isChecking.current = false;
      clearInterval(pollInterval);
      toast.dismiss(TOAST_ID);
    };
  }, []);

  return <Toaster position="bottom-right" />;
}
