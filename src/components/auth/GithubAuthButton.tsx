
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Github } from "lucide-react";

export const GithubAuthButton = () => {
  const handleGithubAuth = async () => {
    try {
      console.log("Starting GitHub authentication...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `https://app.nextwaveai.solutions/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error("GitHub auth error:", error);
        throw error;
      }

      console.log("GitHub auth response:", data);
    } catch (error: any) {
      console.error("GitHub auth error details:", error);
      toast.error(error.message || "Failed to connect to GitHub");
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleGithubAuth}
      className="w-full mb-4"
    >
      <Github className="w-4 h-4 mr-2" />
      Continue with GitHub
    </Button>
  );
};
