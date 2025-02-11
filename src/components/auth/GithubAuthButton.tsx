
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Github } from "lucide-react";

export const GithubAuthButton = () => {
  const handleGithubAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
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
