import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, LogOut, Menu, X, Zap } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", authRequired: true },
  { label: "New Project", href: "/wizard", authRequired: true },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing, isLoggingIn, login, clear } =
    useInternetIdentity();
  const qc = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleAuth = () => {
    if (isAuthenticated) {
      clear();
      qc.clear();
    } else {
      login();
    }
  };

  const visibleLinks = NAV_LINKS.filter(
    (l) => !l.authRequired || isAuthenticated,
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-subtle">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.logo_link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-elevated group-hover:scale-105 transition-smooth">
              <Zap
                className="w-4 h-4 text-primary-foreground"
                fill="currentColor"
              />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              Forge
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                  currentPath === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "_")}_link`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAuth}
                disabled={isInitializing || isLoggingIn}
                className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground"
                data-ocid="nav.logout_button"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleAuth}
                disabled={isInitializing || isLoggingIn}
                className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="nav.login_button"
              >
                <LogIn className="w-4 h-4" />
                {isInitializing
                  ? "Loading…"
                  : isLoggingIn
                    ? "Signing in…"
                    : "Sign In"}
              </Button>
            )}

            {/* Dashboard icon shortcut (auth) */}
            {isAuthenticated && (
              <Link to="/dashboard" data-ocid="nav.dashboard_icon_link">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="sr-only">Dashboard</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="nav.mobile_menu_button"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1 animate-slide-up">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-smooth ${
                  currentPath === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setMobileOpen(false)}
                data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/ /g, "_")}_link`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-1">
              <Button
                variant={isAuthenticated ? "ghost" : "default"}
                size="sm"
                onClick={() => {
                  handleAuth();
                  setMobileOpen(false);
                }}
                disabled={isInitializing || isLoggingIn}
                className="w-full justify-start gap-2"
                data-ocid="nav.mobile.auth_button"
              >
                {isAuthenticated ? (
                  <>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Zap
                className="w-3 h-3 text-primary-foreground"
                fill="currentColor"
              />
            </div>
            <span className="font-display font-semibold text-sm text-foreground">
              Forge
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-smooth"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
