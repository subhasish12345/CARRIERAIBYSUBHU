
"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore"; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getNewUserProfile } from "@/lib/user-profile";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "Password must be at least 6 characters long.",
        });
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const fullName = `${firstName} ${lastName}`.trim();
      await updateProfile(user, { displayName: fullName });

      const newUserProfile = getNewUserProfile(user);
      
      await setDoc(doc(db, "users", user.uid), newUserProfile);

      await sendEmailVerification(user);

      toast({
        title: "Registration Successful!",
        description: "A verification email has been sent. Please check your inbox (and spam folder) to activate your account.",
      });

      await auth.signOut();

      router.push('/login');

    } catch (error: any) {
      console.error(error);
      let description = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          description = "This email address is already in use by another account. Please log in or use a different email.";
          break;
        case 'auth/invalid-email':
          description = "The email address you entered is not valid. Please check it and try again.";
          break;
        case 'auth/weak-password':
          description = "The password is too weak. Please use a stronger password.";
          break;
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isClient ? (
        <form onSubmit={handleRegister} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input 
                id="first-name" 
                placeholder="Max" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>              
              <Input 
                id="last-name" 
                placeholder="Robinson" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create an account
          </Button>
        </form>
        ) : (
          <div className="flex items-center justify-center h-80">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
