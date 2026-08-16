"use client";

import * as React from "react";

interface PaymentIconProps {
  className?: string;
  size?: number;
}

/**
 * Authentic Green Cash Banknote Icon with Taka symbol (৳)
 */
export function CashIcon({ className = "size-5", size = 20 }: PaymentIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="5" width="20" height="14" rx="3.5" fill="url(#cash-grad)" />
      <rect
        x="3.5"
        y="6.5"
        width="17"
        height="11"
        rx="2"
        stroke="#A7F3D0"
        strokeWidth="0.8"
        strokeDasharray="2 1"
        strokeOpacity="0.8"
      />
      <circle cx="12" cy="12" r="3.5" fill="#047857" stroke="#6EE7B7" strokeWidth="0.8" />
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="8"
        fontWeight="900"
        fontFamily="sans-serif"
      >
        ৳
      </text>
      <circle cx="6" cy="9" r="1.2" fill="#D1FAE5" opacity="0.9" />
      <circle cx="18" cy="15" r="1.2" fill="#D1FAE5" opacity="0.9" />
      <defs>
        <linearGradient id="cash-grad" x1="2" y1="5" x2="22" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Authentic bKash Pink Origami Bird Logo
 */
export function BkashIcon({ className = "size-5", size = 20 }: PaymentIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="5" fill="#E2136E" />
      {/* Origami Bird vectors */}
      <path
        d="M4.5 13.2L12.5 4.5L14.8 10.8L19.5 7.8L16.2 16.8L10.8 13.8L7.8 19.5L4.5 13.2Z"
        fill="white"
      />
      <path
        d="M12.5 4.5L14.8 10.8L10.8 13.8L12.5 4.5Z"
        fill="#FCE7F3"
        fillOpacity="0.75"
      />
      <path
        d="M14.8 10.8L19.5 7.8L16.2 16.8L14.8 10.8Z"
        fill="#F472B6"
        fillOpacity="0.4"
      />
    </svg>
  );
}

/**
 * Authentic Nagad Orange/Red Flame Logo
 */
export function NagadIcon({ className = "size-5", size = 20 }: PaymentIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="5" fill="url(#nagad-bg)" />
      {/* Dynamic Nagad Flame */}
      <path
        d="M12 4.5C12 4.5 15.5 8 15.5 11C15.5 12.9 13.9 14.5 12 14.5C10.1 14.5 8.5 12.9 8.5 11C8.5 8 12 4.5 12 4.5Z"
        fill="white"
      />
      <path
        d="M12 8C12 8 17.5 10 17.5 14.2C17.5 17.2 15 19.5 12 19.5C9 19.5 6.5 17.2 6.5 14.2C6.5 11.5 9 10.2 9 10.2"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="nagad-bg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7921E" />
          <stop offset="0.6" stopColor="#EE4036" />
          <stop offset="1" stopColor="#D01B24" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Modern Mastercard + Visa Credit Card Icon
 */
export function CardIcon({ className = "size-5", size = 20 }: PaymentIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="1.5" y="4.5" width="21" height="15" rx="3" fill="url(#card-bg)" />
      {/* Magnetic stripe */}
      <rect x="1.5" y="7.5" width="21" height="3" fill="#1E293B" />
      {/* Chip */}
      <rect x="4" y="12" width="4" height="3" rx="0.6" fill="#FBBF24" stroke="#D97706" strokeWidth="0.4" />
      {/* Mastercard overlapping circles */}
      <circle cx="16.5" cy="13.5" r="2.2" fill="#EB001B" />
      <circle cx="18.5" cy="13.5" r="2.2" fill="#F79E1B" fillOpacity="0.88" />
      <defs>
        <linearGradient id="card-bg" x1="1.5" y1="4.5" x2="22.5" y2="19.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Rocket (DBBL Mobile Banking) Purple Icon
 */
export function RocketIcon({ className = "size-5", size = 20 }: PaymentIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="5" fill="url(#rocket-bg)" />
      {/* Rocket Flame/Icon */}
      <path
        d="M12 4L14.5 9L18 10L14 13.5L15 18L12 15.5L9 18L10 13.5L6 10L9.5 9L12 4Z"
        fill="white"
      />
      <circle cx="12" cy="11" r="1.5" fill="#8B5CF6" />
      <defs>
        <linearGradient id="rocket-bg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Other Payment Methods (Wallet / Ellipsis) Icon
 */
export function OtherPaymentIcon({ className = "size-5", size = 20 }: PaymentIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="5" fill="url(#other-bg)" />
      <circle cx="7" cy="12" r="1.8" fill="white" />
      <circle cx="12" cy="12" r="1.8" fill="white" />
      <circle cx="17" cy="12" r="1.8" fill="white" />
      <defs>
        <linearGradient id="other-bg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#64748B" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>
    </svg>
  );
}
