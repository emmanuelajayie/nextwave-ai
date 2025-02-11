
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail } from "lucide-react";
import { EmailAuthForm } from "./EmailAuthForm";
import { PhoneAuthForm } from "./PhoneAuthForm";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { GithubAuthButton } from "./GithubAuthButton";

interface AuthFormProps {
  onSignUpSuccess: (email: string) => void;
}

export const AuthForm = ({ onSignUpSuccess }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{isSignUp ? "Create Account" : "Sign In"}</h2>
      </div>

      <div className="space-y-2">
        <GoogleAuthButton />
        <GithubAuthButton />
      </div>

      <div className="relative my-4">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
          Or continue with
        </span>
      </div>

      <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as "email" | "phone")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <EmailAuthForm isSignUp={isSignUp} onSignUpSuccess={onSignUpSuccess} />
        </TabsContent>

        <TabsContent value="phone">
          <PhoneAuthForm />
        </TabsContent>
      </Tabs>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </div>
    </Card>
  );
};
