"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_COOLDOWN = 30;
  const [cooldown, setCooldown] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = window.setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [cooldown]);

  const startCooldown = (secs = DEFAULT_COOLDOWN) => setCooldown(secs);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setMessage(null);
    setError(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Show error message if email not found or other error
        setError(json?.error || "Failed to send reset link. Please try again.");
        return;
      }

      if (json?.cooldown) {
        setMessage("Request received. Please wait before trying again.");
        startCooldown(DEFAULT_COOLDOWN);
      } else {
        setIsSent(true);
        setMessage("Reset link has been sent to your email address.");
        startCooldown(DEFAULT_COOLDOWN);
      }
    } catch (err) {
      console.error("Forgot submit error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setMessage(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Show error message if email not found or other error
        setError(json?.error || "Failed to resend. Please try again.");
        return;
      }

      if (json?.cooldown) {
        setMessage("A reset was recently sent. Please wait before trying again.");
        startCooldown(DEFAULT_COOLDOWN);
      } else {
        setMessage("Reset link resent. Check your inbox.");
        startCooldown(DEFAULT_COOLDOWN);
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">ROBOTiX TaskFlow</span>
        </div>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email address and we&apos;ll send you a reset link</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>

            {message ? <div className="text-sm text-green-600">{message}</div> : null}
            {error ? <div className="text-sm text-destructive">{error}</div> : null}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || !!cooldown}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSent ? "Reset Link Sent" : "Send Reset Link"}
            </Button>

            {isSent ? (
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">Didn&apos;t receive it?</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleResend} disabled={isLoading || cooldown > 0}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Resend
                  </Button>
                  {cooldown > 0 ? <span className="text-xs text-muted-foreground">Try again in {cooldown}s</span> : null}
                </div>
              </div>
            ) : null}

            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
