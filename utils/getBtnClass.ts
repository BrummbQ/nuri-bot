export default function (
  variant: "primary" | "accent" | "custom",
  size?: "small" | "regular",
  disabled?: boolean,
): string {
  let sizeClasses = "px-4 h-10";
  if (size === "small") {
    sizeClasses = "px-2 h-8";
  }

  const defaultClasses = `rounded-md border flex items-center justify-center ${sizeClasses} `;

  switch (variant) {
    case "primary":
      const primaryColor = disabled ? "bg-gray-500" : "bg-gray-700";
      const primaryHoverColor = disabled
        ? "hover:bg-gray-500"
        : "hover:bg-gray-600";
      return (
        defaultClasses +
        `border-gray-700 ${primaryColor} text-white transition-colors ${primaryHoverColor} focus:outline-none focus:ring-2 focus:ring-blue-500`
      );
    case "accent":
    default:
      return (
        defaultClasses +
        "border-gray-700 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      );
  }
}
