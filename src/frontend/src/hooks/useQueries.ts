import { createActor } from "@/backend";
import type {
  GeneratedSite as BackendGeneratedSite,
  SelectedFeatures as BackendSelectedFeatures,
  SiteType as BackendSiteType,
  VisualStyle as BackendVisualStyle,
  backendInterface,
} from "@/backend";
import type {
  GeneratedSite,
  PreLaunchChecks,
  SitePublic,
  SiteSummary,
  UserProfile,
  WizardInput,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Helper: cast actor to typed backend interface ───────────────────────────
function asBackend(actor: unknown): backendInterface {
  return actor as unknown as backendInterface;
}

// ─── Backend actor accessor ──────────────────────────────────────────────────
export function useBackend() {
  return useActor(createActor);
}

// ─── Sites Queries ────────────────────────────────────────────────────────────
export function useListMySites() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SiteSummary[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      if (!actor) return [];
      const sites = await asBackend(actor).listMySites();
      return sites.map((s) => ({
        id: s.id,
        title: s.title,
        status: s.status as unknown as SiteSummary["status"],
        subdomain: s.subdomain,
        createdAt: s.createdAt,
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSite(id: bigint | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SitePublic | null>({
    queryKey: ["site", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      const site = await asBackend(actor).getSite(id);
      if (!site) return null;
      return site as unknown as SitePublic;
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useGetPreLaunchChecks(id: bigint | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PreLaunchChecks | null>({
    queryKey: ["prelaunch", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      const checks = await asBackend(actor).getPreLaunchChecks(id);
      // Map backend PreLaunchChecks fields to frontend type
      return {
        seoTitle: checks.seo,
        seoDescription: checks.seo,
        mobileLayout: checks.mobileReady,
        performance: checks.performanceHint,
        formsWorking: checks.formsValid,
        customDomain: false,
      } satisfies PreLaunchChecks;
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

// ─── Sites Mutations ─────────────────────────────────────────────────────────
export function useGenerateSite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<SitePublic, Error, WizardInput>({
    mutationFn: async (input: WizardInput) => {
      if (!actor) throw new Error("Actor not available");
      const backendInput = {
        siteType: input.siteType as unknown as BackendSiteType,
        businessDescription: input.businessDescription,
        visualStyle: {
          primaryColor: "#6366f1",
          secondaryColor: "#a78bfa",
          fontFamily: input.visualStyle,
        } satisfies BackendVisualStyle,
        selectedFeatures: {
          contactForm: input.selectedFeatures.contactForm,
          bookings: input.selectedFeatures.bookings,
          auth: input.selectedFeatures.auth,
        } satisfies BackendSelectedFeatures,
      };
      const site = await asBackend(actor).generateSite(backendInput);
      return site as unknown as SitePublic;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function useUpdateSite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    SitePublic,
    Error,
    { id: bigint; title?: string; generatedData?: GeneratedSite }
  >({
    mutationFn: async ({ id, title, generatedData }) => {
      if (!actor) throw new Error("Actor not available");
      // Backend expects null (not undefined) for optional params
      const site = await asBackend(actor).updateSite(
        id,
        title ?? null,
        generatedData
          ? (generatedData as unknown as BackendGeneratedSite)
          : null,
      );
      return site as unknown as SitePublic;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["sites"] });
      qc.invalidateQueries({ queryKey: ["site", data.id.toString()] });
    },
  });
}

export function useDeleteSite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return asBackend(actor).deleteSite(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function usePublishSite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<SitePublic, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      const site = await asBackend(actor).publishSite(id);
      return site as unknown as SitePublic;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["sites"] });
      qc.invalidateQueries({ queryKey: ["site", data.id.toString()] });
    },
  });
}

// ─── Profile Queries ─────────────────────────────────────────────────────────
export function useGetCallerProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return asBackend(actor).getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerProfile() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return asBackend(actor).saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}
