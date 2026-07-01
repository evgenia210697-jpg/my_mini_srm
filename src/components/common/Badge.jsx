export default function Badge({ label, color, bg, pulse = false, size = 'sm' }) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${sizeClasses} ${pulse ? 'pulse-urgent' : ''}`}
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}
