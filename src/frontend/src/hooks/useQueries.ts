import { createActor } from "@/backend";
import type {
  PreLaunchChecks,
  SitePublic,
  SiteSummary,
  UserProfile,
  WizardInput,
  backendInterface,
} from "@/backend";
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
      return asBackend(actor).listMySites();
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
      return asBackend(actor).getSite(id);
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
      return asBackend(actor).getPreLaunchChecks(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

// ─── Sites Mutations ─────────────────────────────────────────────────────────
// generateSite returns [SiteId, string] tuple
export function useGenerateSite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<[bigint, string], Error, WizardInput>({
    mutationFn: async (input: WizardInput) => {
      if (!actor) throw new Error("Actor not available");
      return asBackend(actor).generateSite(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function useUpdateSite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    SitePublic | null,
    Error,
    { id: bigint; name?: string; niche?: string }
  >({
    mutationFn: async ({ id, name, niche }) => {
      if (!actor) throw new Error("Actor not available");
      return asBackend(actor).updateSite(id, { name, niche });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["sites"] });
      if (data)
        qc.invalidateQueries({ queryKey: ["site", data.id.toString()] });
    },
  });
}

export function useDeleteSite() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, bigint>({
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
  return useMutation<SitePublic | null, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return asBackend(actor).publishSite(id);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["sites"] });
      if (data)
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
      return asBackend(actor).getCallerProfile();
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
  return useMutation<UserProfile, Error, { name: string; email: string }>({
    mutationFn: async ({ name, email }) => {
      if (!actor) throw new Error("Actor not available");
      return asBackend(actor).saveCallerProfile(name, email);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}
