import React from "react";

interface CircleStatProps {
  label: string;
  value: number;
  color: string;
  subtitle?: string;
}

export const CircleStat: React.FC<CircleStatProps> = ({ label, value, color, subtitle }) => (
  <div className="flex flex-col items-center">
    <svg width={110} height={110}>
      <circle
        cx={55}
        cy={55}
        r={48}
        stroke="#232526"
        strokeWidth={10}
        fill="none"
      />
      <circle
        cx={55}
        cy={55}
        r={48}
        stroke={color}
        strokeWidth={7}
        fill="none"
        strokeDasharray={2 * Math.PI * 48}
        strokeDashoffset={2 * Math.PI * 48 * (1 - value / 100)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s" }}
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        fill={color}
        fontSize="2rem"
        fontWeight="bold"
        dy=".3em"
      >
        {value}%
      </text>
    </svg>
    <div className="mt-2 text-[#f5e9c6] font-semibold">{label}</div>
    {subtitle && <div className="text-[#bfa14a] text-sm mt-1">{subtitle}</div>}
  </div>
);
