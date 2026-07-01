export default function WidgetCard({ title, action, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#EEF0F3] p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-sm font-semibold text-[#16181C]">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
