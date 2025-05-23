import { CheckCircle2, PlayCircle, Clock } from "lucide-react";

export const getStatusIcon = (status: string, size = 5) => {
  switch (status) {
    case "completada":
      return <CheckCircle2 className={`w-${size} h-${size} text-green-500`} />;
    case "em progresso":
      return <PlayCircle className={`w-${size} h-${size} text-blue-500`} />;
    default:
      return <Clock className={`w-${size} h-${size} text-yellow-500`} />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completada":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    case "em progresso":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
  }
};
