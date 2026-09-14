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
            // Dismiss it after 3 seconds
            setTimeout(() => {
              toast.dismiss(TOAST_ID);
            }, 3000);
          }
          clearInterval(pollInterval);
        } else {
          throw new Error("Backend not ready");
        }
      } catch (err) {
        // Still waiting
        if (!isWaiting) {
          isWaiting = true;
          toast.loading("Waiting for backend server to start, give it a min...", { 
            duration: Infinity,
            id: TOAST_ID 
          });
        }
      }
    };

    // Check immediately
    checkHealth();

    // Poll every 5 seconds
    pollInterval = setInterval(checkHealth, 5000);

    return () => {
      isChecking.current = true; // Prevent re-running in strict mode
      clearInterval(pollInterval);
      toast.dismiss(TOAST_ID);
    };
  }, []);

  return (
    <Toaster 
      position="top-center" 
      toastOptions={{
        style: {
          background: '#334155',
          color: '#fff',
          borderRadius: '9999px',
          padding: '12px 24px',
          fontWeight: '500',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        },
        success: {
          iconTheme: {
            primary: '#4ade80',
            secondary: '#334155',
          },
        },
      }} 
    />
  );
}
