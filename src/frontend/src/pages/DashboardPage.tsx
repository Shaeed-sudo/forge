import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteSite,
  useGetCallerProfile,
  useListMySites,
} from "@/hooks/useQueries";
import type { SiteSummary } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  Briefcase,
  Clock,
  CreditCard,
  Edit3,
  ExternalLink,
  Globe,
  LayoutDashboard,
  Link as LinkIcon,
  MoreHorizontal,
  MousePointerClick,
  Plus,
  Rocket,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function siteUrl(site: SiteSummary): string {
  return site.siteUrl ?? `${site.slug}.forge.app`;
}

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
};
const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Globe, label: "My Sites" },
  { icon: BarChart2, label: "Analytics" },
  { icon: LinkIcon, label: "Domains" },
];

type NavBottomItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};
const NAV_BOTTOM: NavBottomItem[] = [
  { icon: CreditCard, label: "Billing" },
  { icon: Settings, label: "Settings" },
];

// ─── Root ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardShell />
    </ProtectedRoute>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────

function DashboardShell() {
  const { data: sites, isLoading, isError } = useListMySites();
  const { data: profile } = useGetCallerProfile();

  const displayName = profile?.name ?? "User";
  const initials = getInitials(displayName);

  const hasSites = !isLoading && !isError && sites && sites.length > 0;

  return (
    <div
      className="flex h-screen overflow-hidden bg-card"
      data-ocid="dashboard.page"
    >
      {/* ── Sidebar ── */}
      <aside
        className="w-[216px] flex-shrink-0 bg-card border-r border-border flex flex-col py-4 px-[10px] overflow-hidden"
        data-ocid="dashboard.sidebar"
      >
        {/* Logo */}
        <div className="px-2 mb-5">
          <span className="font-display font-extrabold text-[18px] tracking-tight text-foreground">
            Forge<span className="text-primary">.</span>
          </span>
        </div>

        {/* Primary nav */}
        <nav className="flex flex-col gap-[2px]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={[
                "flex items-center gap-[9px] px-[10px] py-2 rounded-sm text-[13px] font-display font-medium transition-forge cursor-pointer w-full text-left",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-background hover:text-foreground",
              ].join(" ")}
              data-ocid={`dashboard.sidebar.${item.label.toLowerCase().replace(" ", "_")}.link`}
            >
              <item.icon
                className={`w-[15px] h-[15px] flex-shrink-0 ${
                  item.active ? "text-primary" : ""
                }`}
              />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-[6px] mx-1 h-px bg-border" />

        {/* Bottom nav */}
        <div className="flex flex-col gap-[2px]">
          {NAV_BOTTOM.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-[9px] px-[10px] py-2 rounded-sm text-[13px] font-display font-medium text-muted-foreground hover:bg-background hover:text-foreground transition-forge cursor-pointer w-full text-left"
              data-ocid={`dashboard.sidebar.${item.label.toLowerCase()}.link`}
            >
              <item.icon className="w-[15px] h-[15px] flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        {/* User profile */}
        <div className="mt-auto">
          <button
            type="button"
            className="w-full flex items-center gap-[9px] px-2 py-[9px] rounded-sm hover:bg-background transition-forge cursor-pointer"
            data-ocid="dashboard.sidebar.user_profile"
          >
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <span className="font-display font-bold text-[12px] text-primary">
                {initials}
              </span>
            </div>
            <div className="text-left min-w-0">
              <div className="font-display font-semibold text-[12px] text-foreground truncate">
                {displayName}
              </div>
              <div className="text-[11px] text-muted-foreground">Free plan</div>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto bg-background">
        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <ErrorState />
        ) : hasSites ? (
          <HasSitesView sites={sites!} />
        ) : (
          <ZeroState />
        )}
      </main>
    </div>
  );
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="p-8" data-ocid="dashboard.loading_state">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-md" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[185px] rounded-md" />
        ))}
      </div>
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────

function ErrorState() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4 text-center p-8"
      data-ocid="dashboard.error_state"
    >
      <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
        <Briefcase className="w-6 h-6 text-destructive" />
      </div>
      <div>
        <h2 className="font-display font-bold text-lg text-foreground mb-1">
          Couldn't load your sites
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Something went wrong fetching your data. Refresh the page to try
          again.
        </p>
      </div>
    </div>
  );
}

// ─── STATE A: Has Sites ──────────────────────────────────────────────────────

function HasSitesView({ sites }: { sites: SiteSummary[] }) {
  const publishedCount = sites.filter((s) => s.status === "live").length;

  const STATS = [
    {
      icon: Globe,
      value: String(publishedCount),
      label: "Published sites",
      trend: "↑ Just launched",
    },
    { icon: Globe, value: "24", label: "Visitors today", trend: "↑ 24 new" },
    {
      icon: MousePointerClick,
      value: "6",
      label: "Form submissions",
      trend: "↑ 6 new",
    },
    { icon: Zap, value: "97", label: "Lighthouse score", trend: "↑ Top 5%" },
  ];

  return (
    <div className="p-7 pl-8" data-ocid="dashboard.has_sites">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[21px] text-foreground tracking-tight mb-[3px]">
            Welcome back 👋
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Here's what's happening with your sites today.
          </p>
        </div>
        <Link to="/wizard" data-ocid="dashboard.new_site_button">
          <button
            type="button"
            className="flex items-center gap-[7px] bg-primary text-primary-foreground font-display font-semibold text-[13px] px-[18px] py-[9px] rounded-sm hover:opacity-90 transition-forge"
          >
            <Plus className="w-[14px] h-[14px]" />
            New Site
          </button>
        </Link>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-4 gap-3 mb-6"
        data-ocid="dashboard.stats_row"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-md px-[18px] py-4"
            data-ocid={`dashboard.stat_card.${i + 1}`}
          >
            <div className="w-[34px] h-[34px] bg-primary/10 rounded-[7px] flex items-center justify-center mb-[10px]">
              <stat.icon className="w-[17px] h-[17px] text-primary" />
            </div>
            <div className="font-display font-extrabold text-[24px] text-foreground tracking-tight mb-[2px]">
              {stat.value}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {stat.label}
            </div>
            <div className="text-[11px] text-accent font-display font-semibold mt-[3px]">
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Sites section */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display font-bold text-[13px] text-foreground">
          My Sites
        </span>
        <a
          href="/dashboard"
          className="text-[12px] font-display font-semibold text-primary"
          data-ocid="dashboard.view_all_link"
        >
          View all
        </a>
      </div>

      {/* Sites grid */}
      <div
        className="grid grid-cols-3 gap-[14px] mb-6"
        data-ocid="dashboard.sites_grid"
      >
        {sites.map((site, i) => (
          <SiteCard key={site.id.toString()} site={site} index={i + 1} />
        ))}
        {/* Dashed new card */}
        <Link to="/wizard" data-ocid="dashboard.new_site_card">
          <div className="bg-card border-[1.5px] border-dashed border-border rounded-md h-[185px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/4 transition-forge">
            <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center">
              <Plus className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-display font-semibold text-[12px] text-muted-foreground">
              Build a new site
            </span>
          </div>
        </Link>
      </div>

      {/* Pro upsell */}
      <div
        className="bg-primary/10 border-[1.5px] border-primary/30 rounded-md p-[18px] flex items-center gap-[18px]"
        data-ocid="dashboard.upsell_card"
      >
        <div className="w-[42px] h-[42px] bg-primary rounded-[9px] flex items-center justify-center flex-shrink-0">
          <Rocket className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-[13px] text-foreground mb-[3px]">
            Upgrade to Pro — $29/mo
          </div>
          <div className="text-[12px] text-muted-foreground">
            Connect a custom domain, unlimited sites, app logic, and payments.
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-[6px] bg-primary text-primary-foreground font-display font-semibold text-[12px] px-[14px] py-[7px] rounded-sm hover:opacity-90 transition-forge flex-shrink-0"
          data-ocid="dashboard.upgrade_button"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

// ─── Site Card ───────────────────────────────────────────────────────────────

function SiteCard({ site, index }: { site: SiteSummary; index: number }) {
  const navigate = useNavigate();
  const { mutateAsync: deleteSite, isPending: isDeleting } = useDeleteSite();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isLive = site.status === "live";
  const url = siteUrl(site);

  const handleDelete = async () => {
    try {
      await deleteSite(site.id);
      toast.success(`"${site.name}" was deleted.`);
    } catch {
      toast.error("Failed to delete. Please try again.");
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="bg-card border border-border rounded-md overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(0,81,255,0.08)] transition-forge w-full text-left"
        data-ocid={`dashboard.site_card.${index}`}
        onClick={() =>
          navigate({
            to: "/editor/$siteId",
            params: { siteId: site.id.toString() },
          })
        }
      >
        {/* Thumbnail */}
        <div
          className="relative h-[110px] border-b border-border flex items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--primary) / 0.08) 0%, oklch(var(--background)) 100%)",
          }}
        >
          {/* Mini site preview */}
          <div className="w-full px-4 text-center">
            <div className="font-display font-extrabold text-[9px] text-primary mb-1">
              {site.name}
            </div>
            <div
              className="h-[3px] bg-primary/30 rounded-sm mx-auto mb-[3px]"
              style={{ width: "60px" }}
            />
            <div
              className="h-[3px] bg-border rounded-sm mx-auto"
              style={{ width: "40px" }}
            />
          </div>
          {/* Live/Draft badge */}
          <span
            className={[
              "absolute top-[7px] right-[7px] font-display font-bold text-[9px] px-[7px] py-[2px] rounded-full",
              isLive
                ? "bg-accent/20 text-accent"
                : "bg-muted-foreground/20 text-muted-foreground",
            ].join(" ")}
          >
            {isLive ? "Live" : "Draft"}
          </span>
        </div>

        {/* Body */}
        <div className="p-[14px]">
          <div className="font-display font-bold text-[12px] text-foreground mb-[2px] truncate">
            {site.name}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground mb-2 truncate">
            {url}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Updated just now
            </span>
            <div
              className="flex items-center gap-[3px]"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 transition-forge"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({
                    to: "/editor/$siteId",
                    params: { siteId: site.id.toString() },
                  });
                }}
                aria-label="Edit site"
                data-ocid={`dashboard.site_card.${index}.edit_button`}
              >
                <Edit3 className="w-[11px] h-[11px] text-muted-foreground" />
              </button>
              <button
                type="button"
                className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 transition-forge"
                aria-label="Open live site"
                data-ocid={`dashboard.site_card.${index}.external_link_button`}
              >
                <ExternalLink className="w-[11px] h-[11px] text-muted-foreground" />
              </button>
              <button
                type="button"
                className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-destructive/40 hover:bg-destructive/8 transition-forge"
                aria-label="More actions"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
                data-ocid={`dashboard.site_card.${index}.delete_button`}
              >
                <MoreHorizontal className="w-[11px] h-[11px] text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          className="max-w-sm"
          data-ocid={`dashboard.site_card.${index}.dialog`}
        >
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              Delete site?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                &quot;{site.name}&quot;
              </span>{" "}
              will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              className="flex-1 border border-border rounded-sm px-3 py-2 text-[13px] font-display font-semibold text-foreground hover:bg-muted/50 transition-forge"
              onClick={() => setConfirmOpen(false)}
              data-ocid={`dashboard.site_card.${index}.cancel_button`}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 bg-destructive text-destructive-foreground rounded-sm px-3 py-2 text-[13px] font-display font-semibold hover:opacity-90 transition-forge disabled:opacity-50"
              onClick={handleDelete}
              disabled={isDeleting}
              data-ocid={`dashboard.site_card.${index}.confirm_button`}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── STATE B: Zero State ─────────────────────────────────────────────────────

const ZERO_STEPS = [
  {
    num: 1,
    title: "Describe your site",
    desc: "Answer 4 quick questions — no typing required",
  },
  {
    num: 2,
    title: "Watch it get built",
    desc: "Forge designs, writes copy, and adds your features",
  },
  {
    num: 3,
    title: "Tweak and publish",
    desc: "Edit anything inline, then go live in one click",
  },
];

const TEMPLATES = [
  {
    name: "Portfolio",
    cat: "Designer / Creator",
    color: "from-primary/10 to-primary/5",
    barColor: "bg-primary",
  },
  {
    name: "Landing Page",
    cat: "Product / SaaS",
    color: "from-accent/10 to-accent/5",
    barColor: "bg-accent",
  },
  {
    name: "eCommerce",
    cat: "Shop / Store",
    color: "from-orange-400/10 to-orange-400/5",
    barColor: "bg-orange-400",
  },
  {
    name: "SaaS Dashboard",
    cat: "App / Tool",
    color: "from-foreground/10 to-foreground/5",
    barColor: "bg-foreground/40",
  },
];

function ZeroState() {
  return (
    <div
      className="flex flex-col overflow-y-auto"
      data-ocid="dashboard.zero_state"
    >
      {/* Welcome hero */}
      <div
        className="border-b border-border px-12 py-13 flex gap-16 items-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--primary) / 0.07) 0%, oklch(var(--background)) 55%)",
          padding: "52px 48px",
        }}
      >
        {/* Left */}
        <div className="flex-1 max-w-[480px]">
          <div className="inline-flex items-center gap-[7px] bg-card border border-border rounded-full px-[14px] py-[5px] text-[11px] font-display font-bold text-muted-foreground mb-5">
            <Sparkles className="w-3 h-3 text-primary" />
            Account ready
          </div>
          <h1 className="font-display font-black text-[32px] text-foreground tracking-tight leading-[1.1] mb-3">
            Build your first <br />
            <span className="text-primary">site in 60 seconds.</span>
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-7 max-w-[400px]">
            Tell Forge what you need in plain English. It'll design, write, and
            build it — then hand it to you to publish.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/wizard"
              data-ocid="dashboard.zero_state.start_building_button"
            >
              <button
                type="button"
                className="flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-[15px] px-7 py-[13px] rounded-md hover:opacity-90 transition-forge"
              >
                <Zap className="w-4 h-4" />
                Start building — it's free
              </button>
            </Link>
            <button
              type="button"
              className="flex items-center gap-2 border border-border rounded-md px-6 py-[12px] text-[15px] font-display font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-forge"
              data-ocid="dashboard.zero_state.browse_templates_button"
            >
              Browse templates
            </button>
          </div>
        </div>

        {/* Right: steps */}
        <div className="flex-shrink-0 w-[320px] flex flex-col gap-2">
          {ZERO_STEPS.map((step) => (
            <Link key={step.num} to="/wizard">
              <div
                className="flex items-start gap-[14px] p-4 bg-card border border-border rounded-md hover:border-primary/40 hover:bg-primary/4 transition-forge cursor-pointer"
                data-ocid={`dashboard.zero_state.step.${step.num}`}
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 text-primary font-display font-extrabold text-[12px] flex items-center justify-center flex-shrink-0 mt-[1px]">
                  {step.num}
                </div>
                <div>
                  <div className="font-display font-bold text-[13px] text-foreground mb-[3px]">
                    {step.title}
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    {step.desc}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Templates section */}
      <div className="px-12 py-8" style={{ padding: "32px 48px" }}>
        <div className="font-display font-extrabold text-[16px] text-foreground tracking-tight mb-[6px]">
          Start from a template
        </div>
        <div className="text-[13px] text-muted-foreground mb-5">
          Or skip the wizard and pick a starting point. Fully editable once
          generated.
        </div>
        <div
          className="grid grid-cols-4 gap-[14px]"
          data-ocid="dashboard.zero_state.template_grid"
        >
          {TEMPLATES.map((tpl) => (
            <Link key={tpl.name} to="/wizard">
              <div
                className="bg-card border-[1.5px] border-border rounded-md overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(0,81,255,0.09)] hover:-translate-y-[2px] transition-forge"
                data-ocid={`dashboard.zero_state.template.${tpl.name.toLowerCase().replace(" ", "_")}`}
              >
                {/* Mini thumb */}
                <div
                  className={`h-[90px] border-b border-border flex items-center justify-center p-3 bg-gradient-to-br ${tpl.color}`}
                >
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className={`h-[5px] ${tpl.barColor} opacity-80 rounded-[2px] w-[50%]`}
                    />
                    <div
                      className={`h-[5px] ${tpl.barColor} opacity-40 rounded-[2px] w-[80%]`}
                    />
                    <div
                      className={`h-[5px] ${tpl.barColor} opacity-30 rounded-[2px] w-[60%] mt-[3px]`}
                    />
                    <div
                      className={`h-4 ${tpl.barColor} opacity-60 rounded-[3px] w-[40%] mt-1`}
                    />
                  </div>
                </div>
                <div className="px-3 py-[10px]">
                  <div className="font-display font-bold text-[12px] text-foreground mb-[2px]">
                    {tpl.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {tpl.cat}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Empty activity */}
      <div
        className="px-12 pb-10"
        style={{ padding: "0 48px 40px" }}
        data-ocid="dashboard.zero_state.empty_activity"
      >
        <div className="font-display font-extrabold text-[16px] text-foreground tracking-tight mb-3">
          Recent activity
        </div>
        <div
          className="bg-card border border-border rounded-md px-8 py-12 text-center"
          data-ocid="dashboard.zero_state.empty_state"
        >
          <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="font-display font-bold text-[15px] text-foreground mb-[6px]">
            Nothing here yet
          </div>
          <p className="text-[13px] text-muted-foreground mb-5 max-w-[280px] mx-auto leading-relaxed">
            Once you build and publish your first site, your activity, visitor
            stats, and form submissions will show up here.
          </p>
          <Link to="/wizard">
            <button
              type="button"
              className="flex items-center gap-2 bg-primary text-primary-foreground font-display font-semibold text-[12px] px-[14px] py-[7px] rounded-sm hover:opacity-90 transition-forge mx-auto"
              data-ocid="dashboard.zero_state.empty_state.build_button"
            >
              <Zap className="w-[13px] h-[13px]" />
              Build my first site
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
