import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { LogIn, Shield, Zap } from "lucide-react";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, login } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div
        className="flex-1 flex items-center justify-center min-h-[80vh] px-4 py-12"
        data-ocid="login.page"
      >
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated animate-slide-up">
            {/* Logo mark */}
            <div className="flex flex-col items-center mb-8 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-elevated">
                <Zap
                  className="w-8 h-8 text-primary-foreground"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
              <span className="font-display font-bold text-xl text-foreground tracking-tight">
                Forge
              </span>
            </div>

            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-2xl text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sign in with Internet Identity to create and manage your
                AI-generated sites.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={login}
              disabled={isInitializing || isLoggingIn}
              data-ocid="login.sign_in_button"
            >
              <LogIn className="w-5 h-5" />
              {isInitializing
                ? "Loading…"
                : isLoggingIn
                  ? "Opening sign-in…"
                  : "Sign In with Internet Identity"}
            </Button>

            {/* Trust badge */}
            <div className="flex items-center gap-2 mt-6 p-3 rounded-lg bg-muted/40 border border-border">
              <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground leading-snug">
                Internet Identity is a secure, privacy-preserving login system.
                No passwords, no email required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
