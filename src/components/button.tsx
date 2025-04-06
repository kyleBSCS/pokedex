import { ButtonProps } from "@/types/types";
import { getBGColorForType } from "@/utils/typeColors";

export default function Button({
  name,
  label,
  isActive,
  onClick,
  colorType = "default",
}: ButtonProps) {
  const handleClick = () => {
    onClick(name);
  };

  let textColor = "text-gray-700";
  let borderColor = "border-transparent";
  let bgColorStyle = { backgroundColor: "rgb(243 244 246)" };

  if (isActive) {
    borderColor = "border-black";
    if (colorType === "type") {
      const bgColor = getBGColorForType(name);
      bgColorStyle = { backgroundColor: bgColor };
      textColor = "text-white";
    } else {
      bgColorStyle = { backgroundColor: "#2563eb" };
      textColor = "text-white";
    }
  }

  return (
    <button
      className={`p-2 h-full w-full rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${textColor} ${borderColor} whitespace-nowrap capitalize`}
      onClick={handleClick}
      style={{ ...bgColorStyle }}
    >
      {label ?? name}
    </button>
  );
}
