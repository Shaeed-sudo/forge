import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteSite, useListMySites } from "@/hooks/useQueries";
import type { SiteSummary } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import { Clock, Edit2, Globe, Plus, Rocket, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SKELETON_KEYS = ["a", "b", "c"];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { data: sites, isLoading } = useListMySites();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10" data-ocid="dashboard.page">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              My Sites
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage and publish your AI-generated websites.
            </p>
          </div>
          <Link to="/wizard">
            <Button
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              data-ocid="dashboard.create_new_site_button"
            >
              <Plus className="w-4 h-4" />
              Create New Site
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="dashboard.loading_state"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${SKELETON_KEYS[i]}`}
                className="h-52 rounded-xl"
              />
            ))}
          </div>
        ) : !sites || sites.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sites.map((site, i) => (
              <SiteCard key={site.id.toString()} site={site} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-28 gap-5 text-center"
      data-ocid="dashboard.empty_state"
    >
      {/* Illustration area */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-primary/10 animate-pulse" />
        <div className="absolute inset-3 rounded-2xl bg-primary/5" />
        <Zap
          className="relative w-12 h-12 text-primary"
          fill="currentColor"
          strokeWidth={0}
        />
      </div>
      <div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">
          Your first site is one prompt away
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
          Describe your business in plain language and Forge builds the entire
          site — design, content, and features — in minutes.
        </p>
      </div>
      <Link to="/wizard">
        <Button
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 mt-1"
          data-ocid="dashboard.empty_state.build_button"
        >
          <Zap className="w-5 h-5" fill="currentColor" strokeWidth={0} />
          Build Your Site
        </Button>
      </Link>
    </div>
  );
}

function SiteCard({ site, index }: { site: SiteSummary; index: number }) {
  const navigate = useNavigate();
  const { mutateAsync: deleteSite, isPending: isDeleting } = useDeleteSite();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const formattedDate = new Date(
    Number(site.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = async () => {
    try {
      await deleteSite(site.id);
      toast.success(`"${site.title}" was deleted.`);
    } catch {
      toast.error("Failed to delete site. Please try again.");
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div
        className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-primary/40 transition-smooth group animate-slide-up"
        data-ocid={`dashboard.site_card.${index}`}
      >
        {/* Title + badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-smooth truncate min-w-0 flex-1">
            {site.title}
          </h3>
          <StatusBadge status={site.status} />
        </div>

        {/* Subdomain */}
        {site.subdomain ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{site.subdomain}.forge.app</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50 italic">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>Not yet published</span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{formattedDate}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs h-8 border-border hover:border-primary/40 hover:text-primary"
            onClick={() =>
              navigate({
                to: "/editor/$siteId",
                params: { siteId: site.id.toString() },
              })
            }
            data-ocid={`dashboard.site_card.${index}.edit_button`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </Button>

          {site.status !== "published" && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5 text-xs h-8 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60"
              onClick={() =>
                navigate({
                  to: "/publish/$siteId",
                  params: { siteId: site.id.toString() },
                })
              }
              data-ocid={`dashboard.site_card.${index}.publish_button`}
            >
              <Rocket className="w-3.5 h-3.5" />
              Publish
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => setConfirmOpen(true)}
            aria-label="Delete site"
            data-ocid={`dashboard.site_card.${index}.delete_button`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Delete confirm dialog */}
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
                &#34;{site.title}&#34;
              </span>{" "}
              will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmOpen(false)}
              data-ocid={`dashboard.site_card.${index}.cancel_button`}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              data-ocid={`dashboard.site_card.${index}.confirm_button`}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <Badge
        variant="outline"
        className="shrink-0 text-xs border-green-500/30 text-green-400 bg-green-500/10 capitalize"
      >
        Published
      </Badge>
    );
  }
  if (status === "publishing") {
    return (
      <Badge
        variant="outline"
        className="shrink-0 text-xs border-accent/30 text-accent bg-accent/10 capitalize"
      >
        Publishing
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge
        variant="outline"
        className="shrink-0 text-xs border-destructive/30 text-destructive bg-destructive/10 capitalize"
      >
        Failed
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="shrink-0 text-xs border-border text-muted-foreground bg-muted/50 capitalize"
    >
      Unpublished
    </Badge>
  );
}
