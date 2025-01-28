import React from "react";
const { cn }= require("@repo/ui/lib");
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert = ({
  variant = "info",
  title,
  message,
  onClose,
  className,
}: AlertProps) => {
  const variants = {
    success: {
      container: "bg-green-50 border-green-200",
      icon: "text-green-500",
      title: "text-green-800",
      message: "text-green-700",
      Icon: CheckCircle,
    },
    error: {
      container: "bg-red-50 border-red-200",
      icon: "text-red-500",
      title: "text-red-800",
      message: "text-red-700",
      Icon: AlertCircle,
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-500",
      title: "text-yellow-800",
      message: "text-yellow-700",
      Icon: AlertTriangle,
    },
    info: {
      container: "bg-blue-50 border-blue-200",
      icon: "text-blue-500",
      title: "text-blue-800",
      message: "text-blue-700",
      Icon: Info,
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-all duration-200",
        currentVariant.container,
        className
      )}
      role="alert"
    >
      <currentVariant.Icon
        className={cn("h-5 w-5 flex-shrink-0", currentVariant.icon)}
      />
      <div className="flex-1 space-y-1">
        {title && (
          <h3
            className={cn(
              "text-sm font-medium leading-none tracking-tight",
              currentVariant.title
            )}
          >
            {title}
          </h3>
        )}
        <p
          className={cn(
            "text-sm [&:not(:first-child)]:mt-2",
            currentVariant.message
          )}
        >
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "absolute right-2 top-2 rounded-full p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
            currentVariant.icon
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
