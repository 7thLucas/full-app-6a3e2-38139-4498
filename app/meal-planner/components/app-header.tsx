import { Link, Form } from "react-router";
import { ChefHat, LogOut, User } from "lucide-react";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";

export function AppHeader() {
  const { config, loading } = useConfigurables();
  const { user } = useAuth();

  const appName = loading ? "Happy Meal" : (config.appName ?? "Happy Meal");
  const tagline = loading ? "" : (config.appTagline ?? "Your personal AI meal planner");

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-navbarBackground">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          {config.logoUrl ? (
            <img src={config.logoUrl} alt={appName} className="h-7 w-auto" />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <ChefHat size={15} className="text-primary-foreground" />
            </div>
          )}
          <div className="hidden sm:block">
            <span className="font-bold text-sm text-foreground leading-none">{appName}</span>
            {tagline && (
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{tagline}</p>
            )}
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className="text-xs text-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
          >
            Meal Plan
          </Link>
          <Link
            to="/preferences"
            className="text-xs text-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
          >
            Preferences
          </Link>
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <User size={12} />
              {user.username}
            </span>
          )}
          <Form action="/auth/logout" method="post">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-accent"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </Form>
        </div>
      </div>
    </header>
  );
}
