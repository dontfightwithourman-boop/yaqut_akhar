'use client';

export default function YaqutIcon({
  size = 32,
  animate = true,
  className = '',
}: {
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  return (
    <img
      src="/morvarid.png"
      alt="مروارید"
      width={size}
      height={size}
      className={`object-contain ${animate ? 'animate-pulse' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        background: 'transparent',
      }}
    />
  );
}
