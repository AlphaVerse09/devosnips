
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/firebase/config";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ChromeIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const emailPasswordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

type EmailPasswordFormValues = z.infer<typeof emailPasswordFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const form = useForm<EmailPasswordFormValues>({
    resolver: zodResolver(emailPasswordFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFirebaseAuthError = (error: any) => {
    setIsLoading(false);
    let title = "Authentication Failed";
    let description = "An unexpected error occurred. Please try again.";

    switch (error.code) {
      case "auth/invalid-email":
        description = "The email address is not valid.";
        break;
      case "auth/user-disabled":
        description = "This user account has been disabled.";
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential": // Covers both user-not-found and wrong-password for newer SDK versions
        description = "Invalid email or password. Please try again.";
        break;
      case "auth/email-already-in-use":
        description = "This email address is already in use by another account.";
        break;
      case "auth/weak-password":
        description = "The password is too weak. Please choose a stronger password.";
        break;
      default:
        console.error("Firebase Auth Error:", error);
    }
    toast({ title, description, variant: "destructive" });
  };

  const handleEmailPasswordSubmit = async (values: EmailPasswordFormValues) => {
    setIsLoading(true);
    try {
      if (activeTab === "signin") {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        router.push("/");
        toast({ title: "Login Successful", description: "Welcome back!" });
      } else { // signup
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        router.push("/");
        toast({ title: "Account Created", description: "Welcome to DevoSnips!" });
      }
    } catch (error) {
      handleFirebaseAuthError(error);
    } finally {
      // setIsLoading(false); // Already handled in handleFirebaseAuthError or success path
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error) {
      handleFirebaseAuthError(error);
    } finally {
      // setIsLoading(false); // Already handled
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-auto flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span className="font-bold font-headline text-xl">DevoSnips</span>
          </Link>
          <nav className="flex items-center space-x-2">
            <ThemeToggleButton />
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Welcome to DevoSnips</CardTitle>
            <CardDescription>
              {activeTab === "signin" ? "Sign in to your account" : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEmailPasswordSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && activeTab === "signin" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="signup">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEmailPasswordSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Choose a password (min. 6 characters)" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && activeTab === "signup" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              className="w-full"
              variant="outline"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <ChromeIcon className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
