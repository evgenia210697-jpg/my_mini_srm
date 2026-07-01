export default function ProgressBar({ value, size = 'md', color = '#2D6BFF' }) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className={`w-full ${height} bg-[#EDEFF3] rounded-full overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
      />
    </div>
  );
}
