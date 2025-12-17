import type { SVGProps } from 'react';

export function CurtainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4v16" />
      <path d="M12.42 4c.18 1.1.35 2.2.58 3.29.23 1.09.51 2.19.85 3.26.34 1.08.73 2.11 1.15 3.11" />
      <path d="M15 13.66c.42.99.81 2.02 1.15 3.11.34 1.07.62 2.17.85 3.26.23 1.09.4 2.19.58 3.29" />
      <path d="M20 4v16" />
    </svg>
  );
}
