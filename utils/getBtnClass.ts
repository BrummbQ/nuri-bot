export default function (
  variant: "primary" | "accent" | "custom" | "outline",
  size?: "small" | "regular",
  disabled?: boolean,
): string {
  let sizeClasses = "px-4 h-auto py-2";
  if (size === "small") {
    sizeClasses = "px-2 h-8";
  }

  const defaultClasses = `rounded-md flex items-center justify-center ${sizeClasses} `;

  switch (variant) {
    case "primary":
      const primaryColor = disabled ? "bg-primary-300" : "bg-primary";
      const primaryHoverColor = disabled
        ? "hover:bg-primary-300"
        : "hover:bg-primary-600";
      return (
        defaultClasses +
        ` ${primaryColor} text-white transition-colors ${primaryHoverColor} focus:outline-none focus:ring-2 focus:ring-blue-500`
      );
    case "accent":
      return (
        defaultClasses +
        "text-gray-700 transition-colors bg-accent hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      );
    case "outline":
    default:
      return (
        defaultClasses +
        "border border-gray-700 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      );
  }
}
