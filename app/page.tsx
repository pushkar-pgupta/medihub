"use client";

import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
//  
import { cn } from "@/lib/utils"; // optional helper for Tailwind merging if you already have it

export default function LandingPage() {
  const [role, setRole] = useState("citizen");
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Sign In</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select your role and continue
          </p>
        </div>

        <div className="space-y-4">
          {/* Role Selector */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={setRole} defaultValue={role}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citizen">Citizen</SelectItem>
                <SelectItem value="asha">ASHA Worker</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email (optional aesthetic input) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Continue button that triggers Clerk */}
          <div className="pt-4 text-center">
            <SignInButton
              mode="redirect"
              forceRedirectUrl={`/after-signin?role=${role}`}
            >
              <Button className="w-full">Continue to Sign In</Button>
            </SignInButton>
          </div>
        </div>
      </div>
    </main>
  );
}
