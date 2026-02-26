import { getStatusLabel } from "../../utils/helpers";

export default function StatusBadge({ status }) {
  const label = getStatusLabel(status);

  const getStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-100";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStyles(status)}`}>
      {label}
    </span>
  );
}
