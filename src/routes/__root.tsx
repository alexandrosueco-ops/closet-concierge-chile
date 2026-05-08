import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#ffffff" },
      { title: "VeriCloset — Reventa premium verificada en Chile" },
      { name: "description", content: "Marketplace chileno de ropa, bolsos y zapatillas premium con verificación de autenticidad antes de cada entrega." },
      { property: "og:title", content: "VeriCloset — Reventa premium verificada en Chile" },
      { name: "twitter:title", content: "VeriCloset — Reventa premium verificada en Chile" },
      { property: "og:description", content: "Marketplace chileno de ropa, bolsos y zapatillas premium con verificación de autenticidad antes de cada entrega." },
      { name: "twitter:description", content: "Marketplace chileno de ropa, bolsos y zapatillas premium con verificación de autenticidad antes de cada entrega." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/763b81e5-4ad1-4669-98b8-0f1b40c57441/id-preview-904c2001--b9c67391-9f30-4afb-b81a-0a33ca5277bc.lovable.app-1778245955756.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/763b81e5-4ad1-4669-98b8-0f1b40c57441/id-preview-904c2001--b9c67391-9f30-4afb-b81a-0a33ca5277bc.lovable.app-1778245955756.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
