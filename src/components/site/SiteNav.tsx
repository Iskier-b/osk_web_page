import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { phoneHref, phoneLabel, primaryNav, type PrimaryNavItem, zapisyCta } from "@/lib/site-nav";

interface SiteNavProps {
  currentPath?: string;
}

function pathMatches(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemIsActive(pathname: string, item: PrimaryNavItem): boolean {
  if (pathMatches(pathname, item.href)) return true;
  return item.children?.some((child) => pathMatches(pathname, child.href)) ?? false;
}

export default function SiteNav({ currentPath = "/" }: SiteNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!mobileOpen && openDropdown === null) return;

    function onPointerDown(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, openDropdown]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggleDropdown(key: string) {
    setOpenDropdown((current) => (current === key ? null : key));
  }

  function closeMobile() {
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  return (
    <nav ref={navRef} className="flex items-center gap-2 sm:gap-3" aria-label="Nawigacja główna">
      {/* Desktop primary + CTAs */}
      <ul className="hidden items-center gap-0.5 lg:flex">
        {primaryNav.map((item) => {
          const active = itemIsActive(currentPath, item);
          const hasChildren = Boolean(item.children?.length);
          const dropdownKey = item.href;

          if (!hasChildren) {
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "relative inline-flex rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "text-primary after:bg-primary after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full"
                      : "text-foreground/75 hover:bg-muted/80 hover:text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          }

          const expanded = openDropdown === dropdownKey;

          return (
            <li key={item.href} className="relative">
              <button
                type="button"
                className={cn(
                  "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  active || expanded
                    ? "text-primary after:bg-primary after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full"
                    : "text-foreground/75 hover:bg-muted/80 hover:text-foreground",
                )}
                aria-expanded={expanded}
                aria-haspopup="true"
                onClick={() => {
                  toggleDropdown(dropdownKey);
                }}
              >
                {item.label}
                <ChevronIcon className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <ul className="border-border/80 bg-popover text-popover-foreground animate-in fade-in slide-in-from-top-1 absolute top-full left-0 z-50 mt-2 min-w-60 rounded-lg border py-2 shadow-md duration-200">
                  <li>
                    <a
                      href={item.href}
                      className={cn(
                        "hover:bg-muted block px-4 py-2.5 text-sm font-semibold transition-colors",
                        pathMatches(currentPath, item.href) && "bg-accent text-accent-foreground",
                      )}
                      onClick={() => {
                        setOpenDropdown(null);
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                  {item.children?.map((child) => (
                    <li key={child.href}>
                      <a
                        href={child.href}
                        className={cn(
                          "text-foreground/85 hover:bg-muted hover:text-foreground block px-4 py-2.5 text-sm transition-colors",
                          pathMatches(currentPath, child.href) && "bg-accent text-accent-foreground",
                        )}
                        onClick={() => {
                          setOpenDropdown(null);
                        }}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <div className="hidden items-center gap-3 lg:flex">
        <a href={phoneHref} className="text-foreground/80 hover:text-primary text-sm font-semibold transition-colors">
          {phoneLabel}
        </a>
        <a
          href={zapisyCta.href}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-bold tracking-tight transition-colors"
        >
          {zapisyCta.label}
        </a>
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        className="border-border/80 bg-background text-foreground hover:bg-muted inline-flex size-11 items-center justify-center rounded-md border lg:hidden"
        aria-expanded={mobileOpen}
        aria-controls={menuId}
        aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
        onClick={() => {
          setMobileOpen((open) => !open);
          setOpenDropdown(null);
        }}
      >
        {mobileOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>

      {/* Mobile full-panel sheet */}
      {mobileOpen && (
        <>
          <button
            type="button"
            className="animate-in fade-in bg-foreground/25 fixed inset-0 z-40 duration-200 lg:hidden"
            aria-label="Zamknij menu"
            onClick={closeMobile}
          />
          <div
            id={menuId}
            className="border-border bg-background animate-in fade-in slide-in-from-right-4 fixed inset-y-0 right-0 z-50 flex w-[min(100%,22rem)] flex-col border-l shadow-lg duration-300 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu nawigacji"
          >
            <div className="border-border flex items-center justify-between border-b px-4 py-3.5">
              <p className="text-foreground text-sm font-bold tracking-wide uppercase">Menu</p>
              <button
                type="button"
                className="border-border text-foreground hover:bg-muted inline-flex size-11 items-center justify-center rounded-md border"
                aria-label="Zamknij menu"
                onClick={closeMobile}
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
              {primaryNav.map((item) => {
                const active = itemIsActive(currentPath, item);
                const hasChildren = Boolean(item.children?.length);
                const dropdownKey = item.href;

                if (!hasChildren) {
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={cn(
                          "flex min-h-11 items-center rounded-md px-3 text-base font-semibold",
                          active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted",
                        )}
                        onClick={closeMobile}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }

                const expanded = openDropdown === dropdownKey;

                return (
                  <li key={item.href} className="space-y-1">
                    <button
                      type="button"
                      className={cn(
                        "flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-base font-semibold",
                        active || expanded ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted",
                      )}
                      aria-expanded={expanded}
                      onClick={() => {
                        toggleDropdown(dropdownKey);
                      }}
                    >
                      {item.label}
                      <ChevronIcon className={cn("size-4 transition-transform", expanded && "rotate-180")} />
                    </button>
                    {expanded && (
                      <ul className="border-primary/30 bg-muted/40 space-y-0.5 rounded-md border-l-2 py-1 pl-2">
                        <li>
                          <a
                            href={item.href}
                            className={cn(
                              "flex min-h-11 items-center rounded-md px-3 text-sm font-semibold",
                              pathMatches(currentPath, item.href)
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground/90 hover:bg-muted",
                            )}
                            onClick={closeMobile}
                          >
                            {item.label}
                          </a>
                        </li>
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              className={cn(
                                "flex min-h-11 items-center rounded-md px-3 text-sm",
                                pathMatches(currentPath, child.href)
                                  ? "bg-accent text-accent-foreground"
                                  : "text-foreground/80 hover:bg-muted hover:text-foreground",
                              )}
                              onClick={closeMobile}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="border-border mt-auto flex flex-col gap-2 border-t px-4 py-4">
              <a
                href={phoneHref}
                className="text-foreground hover:bg-muted flex min-h-11 items-center justify-center rounded-md px-3 text-base font-semibold"
                onClick={closeMobile}
              >
                {phoneLabel}
              </a>
              <a
                href={zapisyCta.href}
                className="bg-primary text-primary-foreground inline-flex min-h-12 items-center justify-center rounded-md px-4 text-base font-bold"
                onClick={closeMobile}
              >
                {zapisyCta.label}
              </a>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
