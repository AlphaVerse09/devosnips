"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLogo = () => {
    if (resolvedTheme === "dark") {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <g clipPath="url(#clip0_303_3)">
            <rect x="2" y="4" width="16" height="16" rx="4" fill="#2E9AFE" />
            <path
              d="M7 10L5 12L7 14"
              stroke="#F0F2F5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 10L13 12L11 14"
              stroke="#F0F2F5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.2859 13.0714L18.8573 16.6428"
              stroke="#F0F2F5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.2859 16.6428L18.8573 13.0714"
              stroke="#F0F2F5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="13.7144" cy="11.5" r="1.57143" stroke="#F0F2F5" strokeWidth="1.5" />
            <circle cx="13.7144" cy="18.2143" r="1.57143" stroke="#F0F2F5" strokeWidth="1.5" />
          </g>
          <defs>
            <clipPath id="clip0_303_3">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    }

    // Default to light theme logo
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <g clipPath="url(#clip0_303_2)">
          <rect x="2" y="4" width="16" height="16" rx="4" fill="#2E9AFE" />
          <path
            d="M7 10L5 12L7 14"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 10L13 12L11 14"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.2859 13.0714L18.8573 16.6428"
            stroke="#282C34"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.2859 16.6428L18.8573 13.0714"
            stroke="#282C34"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13.7144" cy="11.5" r="1.57143" stroke="#282C34" strokeWidth="1.5" />
          <circle cx="13.7144" cy="18.2143" r="1.57143" stroke="#282C34" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_303_2">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  // Render a placeholder on initial mount to avoid hydration mismatch
  if (!mounted) {
    return <div className={className || "h-7 w-7"} style={{ width: 24, height: 24 }} />;
  }

  return getLogo();
}