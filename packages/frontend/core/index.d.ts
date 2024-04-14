declare module "#app" {
  interface PageMeta {
    action?: string;
    subject?: string;
    layoutWrapperClasses?: string;
    navActiveLink?: RouteLocationRaw;
    disableSearchbar: boolean;
    unauthenticatedOnly?: boolean;
    public?: boolean;
    activeTab: string;
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
