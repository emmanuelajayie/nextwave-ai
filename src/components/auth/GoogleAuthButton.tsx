
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const GoogleAuthButton = () => {
  const handleGoogleAuth = async () => {
    try {
      console.log("Starting Google authentication...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error("Google auth error:", error);
        throw error;
      }

      console.log("Google auth response:", data);
      // No need for success toast here as the redirect will happen
    } catch (error: any) {
      console.error("Google auth error details:", error);
      toast.error(error.message || "Failed to connect to Google");
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleGoogleAuth}
      className="w-full mb-4"
    >
      <img 
        src="https://www.google.com/favicon.ico" 
        alt="Google" 
        className="w-4 h-4 mr-2"
      />
      Continue with Google
    </Button>
  );
};
