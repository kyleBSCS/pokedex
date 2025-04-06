import { ButtonProps } from "@/types/responses";
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

  let bgColor = "bg-gray-100 hover:bg-gray-200";
  let textColor = "text-gray-700";
  let borderColor = "border-transparent";

  if (isActive) {
    borderColor = "border-black";
    if (colorType === "type") {
      bgColor = getBGColorForType(name);
      textColor = "text-white";
    } else {
      bgColor = "bg-blue-600";
      textColor = "text-white";
    }
  }

  return (
    <button
      className={`p-2 h-full w-full bg-gray-100 rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${bgColor} ${textColor} ${borderColor} whitespace-nowrap capitalize`}
      onClick={handleClick}
    >
      {label ?? name}
    </button>
  );
}
