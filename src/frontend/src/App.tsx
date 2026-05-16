import DashboardPage from "@/pages/DashboardPage";
import EditorPage from "@/pages/EditorPage";
import GeneratePage from "@/pages/GeneratePage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import PublishPage from "@/pages/PublishPage";
import WizardPage from "@/pages/WizardPage";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// ─── Root route ───────────────────────────────────────────────────────────────
const rootRoute = createRootRoute();

// ─── Page routes ─────────────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const wizardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wizard",
  component: WizardPage,
});

const generateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/generate/$siteId",
  component: GeneratePage,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor/$siteId",
  component: EditorPage,
});

const publishRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/publish/$siteId",
  component: PublishPage,
});

// ─── Router ─────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  wizardRoute,
  generateRoute,
  editorRoute,
  publishRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
