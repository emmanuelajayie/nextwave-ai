import { toast } from "sonner";

interface ErrorLog {
  message: string;
  timestamp: string;
  stack?: string;
  recommendation?: string;
}

class ErrorLogger {
  private static logs: ErrorLog[] = [];

  static logError(error: Error, recommendation?: string) {
    const errorLog: ErrorLog = {
      message: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack,
      recommendation: recommendation || this.getRecommendation(error.message),
    };

    this.logs.push(errorLog);
    console.error("Error logged:", errorLog);
    
    // Show error toast with recommendation
    toast.error("An error occurred", {
      description: `${error.message}\n${errorLog.recommendation}`,
      duration: 5000,
    });
  }

  static getLogs(): ErrorLog[] {
    return this.logs;
  }

  private static getRecommendation(errorMessage: string): string {
    // Add common error recommendations
    if (errorMessage.includes("network")) {
      return "Please check your internet connection and try again.";
    }
    if (errorMessage.includes("permission")) {
      return "You may not have the required permissions. Please contact support.";
    }
    return "If this issue persists, please contact support.";
  }
}

export default ErrorLogger;