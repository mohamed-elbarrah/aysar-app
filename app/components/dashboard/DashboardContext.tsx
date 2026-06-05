"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

// Page data types
interface HomePageData {
  hero: unknown;
  featureSections: unknown;
  bentoFeatures: unknown;
  projectOverview: unknown;
  appSection: unknown;
  ctaSection: unknown;
}

interface PlansPageData {
  hero: unknown;
  plans: unknown;
  compareRows: unknown;
  faqItems: unknown;
  yearlyDiscountPercent: number;
}

interface ContactPageData {
  hero: unknown;
  contactInfo: unknown;
  channels: unknown;
  inquiryOptions: unknown;
  successMessage: string;
  formFields: unknown;
  thirdPartyFormScript: string;
  formReplaced: boolean;
}

interface PolicyData {
  privacy: unknown;
  terms: unknown;
  returns: unknown;
}

interface SettingsData {
  metadata: {
    siteTitle: string;
    siteDescription: string;
    faviconUrl: string;
    logoUrl: string;
    seoKeywords: string;
  };
  navLinks: unknown;
  footer: unknown;
  social: unknown;
  apps: unknown;
  contact: unknown;
  platform: unknown;
  hours: unknown;
}

// Dirty tracking per section
interface DirtyState {
  home: {
    hero: boolean;
    featureSections: boolean;
    bentoFeatures: boolean;
    projectOverview: boolean;
    appSection: boolean;
    ctaSection: boolean;
  };
  plans: {
    hero: boolean;
    plans: boolean;
    compareRows: boolean;
    faqItems: boolean;
    yearlyDiscountPercent: boolean;
  };
  contact: {
    hero: boolean;
    contactInfo: boolean;
    channels: boolean;
    inquiryOptions: boolean;
    successMessage: boolean;
    formFields: boolean;
    thirdPartyFormScript: boolean;
    formReplaced: boolean;
  };
  policies: {
    privacy: boolean;
    terms: boolean;
    returns: boolean;
  };
  settings: {
    metadata: boolean;
    navLinks: boolean;
    footer: boolean;
    social: boolean;
    apps: boolean;
    contact: boolean;
    platform: boolean;
    hours: boolean;
  };
}

// Context type
interface DashboardContextType {
  // Data
  homeData: HomePageData | null;
  plansData: PlansPageData | null;
  contactData: ContactPageData | null;
  policiesData: PolicyData | null;
  settingsData: SettingsData | null;
  
  // Loading states
  loading: {
    home: boolean;
    plans: boolean;
    contact: boolean;
    policies: boolean;
    settings: boolean;
  };
  
  // Dirty state
  dirty: DirtyState;
  hasUnsavedChanges: boolean;
  dirtyPages: string[];
  dirtySections: { page: string; section: string }[];
  
  // Update functions
  setHomeData: (data: Partial<HomePageData>, section?: keyof HomePageData) => void;
  setPlansData: (data: Partial<PlansPageData>, section?: keyof PlansPageData) => void;
  setContactData: (data: Partial<ContactPageData>, section?: keyof ContactPageData) => void;
  setPoliciesData: (type: keyof PolicyData, data: unknown) => void;
  setSettingsData: (section: keyof SettingsData, data: unknown) => void;
  
  // Save functions
  saveAll: () => Promise<{ success: boolean; results: { page: string; section: string; success: boolean; error?: string }[] }>;
  savePage: (page: "home" | "plans" | "contact" | "policies" | "settings") => Promise<boolean>;
  isSaving: boolean;
  lastSaved: string | null;
  
  // Reset
  resetAll: () => void;
  discardChanges: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // Data states
  const [homeData, setHomeDataState] = useState<HomePageData | null>(null);
  const [plansData, setPlansDataState] = useState<PlansPageData | null>(null);
  const [contactData, setContactDataState] = useState<ContactPageData | null>(null);
  const [policiesData, setPoliciesDataState] = useState<PolicyData | null>(null);
  const [settingsData, setSettingsDataState] = useState<SettingsData | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    home: true,
    plans: true,
    contact: true,
    policies: true,
    settings: true,
  });
  
  // Dirty tracking
  const [dirty, setDirty] = useState<DirtyState>({
    home: { hero: false, featureSections: false, bentoFeatures: false, projectOverview: false, appSection: false, ctaSection: false },
    plans: { hero: false, plans: false, compareRows: false, faqItems: false, yearlyDiscountPercent: false },
    contact: { hero: false, contactInfo: false, channels: false, inquiryOptions: false, successMessage: false, formFields: false, thirdPartyFormScript: false, formReplaced: false },
    policies: { privacy: false, terms: false, returns: false },
    settings: { metadata: false, navLinks: false, footer: false, social: false, apps: false, contact: false, platform: false, hours: false },
  });
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // Original data (for reset)
  const [originalData, setOriginalData] = useState<{
    home: HomePageData | null;
    plans: PlansPageData | null;
    contact: ContactPageData | null;
    policies: PolicyData | null;
    settings: SettingsData | null;
  }>({ home: null, plans: null, contact: null, policies: null, settings: null });

  // Load all data on mount
  useEffect(() => {
    async function loadAll() {
      try {
        // Load home page
        const homeRes = await fetch("/api/home-page");
        const homeJson = await homeRes.json();
        if (homeJson.success && homeJson.data) {
          const data = {
            hero: homeJson.data.hero,
            featureSections: homeJson.data.featureSections || homeJson.data.feature_sections,
            bentoFeatures: homeJson.data.bentoFeatures || homeJson.data.bento_features,
            projectOverview: homeJson.data.projectOverview || homeJson.data.project_overview,
            appSection: homeJson.data.appSection || homeJson.data.app_section,
            ctaSection: homeJson.data.ctaSection || homeJson.data.cta_section,
          };
          setHomeDataState(data as HomePageData);
          setOriginalData(prev => ({ ...prev, home: data as HomePageData }));
        }
      } catch (e) { console.error("Failed to load home page:", e); }
      finally { setLoading(prev => ({ ...prev, home: false })); }
      
      try {
        // Load plans page
        const plansRes = await fetch("/api/plans-page");
        const plansJson = await plansRes.json();
        if (plansJson.success && plansJson.data) {
          const data = {
            hero: plansJson.data.hero,
            plans: plansJson.data.plans,
            compareRows: plansJson.data.compareRows || plansJson.data.compare_rows,
            faqItems: plansJson.data.faqItems || plansJson.data.faq_items,
            yearlyDiscountPercent: plansJson.data.yearlyDiscountPercent ?? plansJson.data.yearly_discount_percent ?? 15,
          };
          setPlansDataState(data as PlansPageData);
          setOriginalData(prev => ({ ...prev, plans: data as PlansPageData }));
        }
      } catch (e) { console.error("Failed to load plans page:", e); }
      finally { setLoading(prev => ({ ...prev, plans: false })); }
      
      try {
        // Load contact page
        const contactRes = await fetch("/api/contact-page");
        const contactJson = await contactRes.json();
        if (contactJson.success && contactJson.data) {
          const d = contactJson.data;
          const fc = d.formConfig || {};
          const data = {
            hero: d.hero,
            contactInfo: d.contactInfo || d.contact_info,
            channels: d.channels,
            inquiryOptions: d.inquiryOptions || d.inquiry_options,
            successMessage: d.successMessage || d.success_message,
            formFields: d.formFields || d.form_fields,
            thirdPartyFormScript: fc.thirdPartyFormScript ?? d.thirdPartyFormScript ?? "",
            formReplaced: fc.formReplaced ?? d.formReplaced ?? false,
          };
          setContactDataState(data as ContactPageData);
          setOriginalData(prev => ({ ...prev, contact: data as ContactPageData }));
        }
      } catch (e) { console.error("Failed to load contact page:", e); }
      finally { setLoading(prev => ({ ...prev, contact: false })); }
      
      try {
        // Load policies
        const types = ["privacy", "terms", "returns"] as const;
        const policies: Partial<PolicyData> = {};
        for (const type of types) {
          const res = await fetch(`/api/policies/${type}`);
          const json = await res.json();
          if (json.success && json.data) {
            policies[type] = json.data;
          }
        }
        setPoliciesDataState(policies as PolicyData);
        setOriginalData(prev => ({ ...prev, policies: policies as PolicyData }));
      } catch (e) { console.error("Failed to load policies:", e); }
      finally { setLoading(prev => ({ ...prev, policies: false })); }
      
      try {
        // Load settings
        const settingsRes = await fetch("/api/settings");
        const settingsJson = await settingsRes.json();
        if (settingsJson.success && settingsJson.data) {
          const d = settingsJson.data;
          const data = {
            metadata: {
              siteTitle: d.siteTitle || d.site_title || "",
              siteDescription: d.siteDescription || d.site_description || "",
              faviconUrl: d.faviconUrl || d.favicon_url || "",
              logoUrl: d.logoUrl || d.logo_url || "",
              seoKeywords: d.seoKeywords || d.seo_keywords || "",
            },
            navLinks: d.navLinks || d.nav_links,
            footer: d.footerColumns || d.footer_columns,
            social: d.socialLinks || d.social_links,
            apps: d.appLinks || d.app_links,
            contact: d.contactInfo || d.contact_info,
            platform: d.platformLinks || d.platform_links,
            hours: d.workHours || d.work_hours,
          };
          setSettingsDataState(data as SettingsData);
          setOriginalData(prev => ({ ...prev, settings: data as SettingsData }));
        }
      } catch (e) { console.error("Failed to load settings:", e); }
      finally { setLoading(prev => ({ ...prev, settings: false })); }
    }
    
    loadAll();
  }, []);

  // Update functions
  const setHomeData = useCallback((data: Partial<HomePageData>, section?: keyof HomePageData) => {
    setHomeDataState(prev => prev ? { ...prev, ...data } : null);
    if (section) {
      setDirty(prev => ({ ...prev, home: { ...prev.home, [section]: true } }));
    }
  }, []);

  const setPlansData = useCallback((data: Partial<PlansPageData>, section?: keyof PlansPageData) => {
    setPlansDataState(prev => prev ? { ...prev, ...data } : null);
    if (section) {
      setDirty(prev => ({ ...prev, plans: { ...prev.plans, [section]: true } }));
    }
  }, []);

  const setContactData = useCallback((data: Partial<ContactPageData>, section?: keyof ContactPageData) => {
    setContactDataState(prev => prev ? { ...prev, ...data } : null);
    if (section) {
      setDirty(prev => ({ ...prev, contact: { ...prev.contact, [section]: true } }));
    }
  }, []);

  const setPoliciesData = useCallback((type: keyof PolicyData, data: unknown) => {
    setPoliciesDataState(prev => prev ? { ...prev, [type]: data } : null);
    setDirty(prev => ({ ...prev, policies: { ...prev.policies, [type]: true } }));
  }, []);

  const setSettingsData = useCallback((section: keyof SettingsData, data: unknown) => {
    setSettingsDataState(prev => prev ? { ...prev, [section]: data } : null);
    setDirty(prev => ({ ...prev, settings: { ...prev.settings, [section]: true } }));
  }, []);

  // Calculate has unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return Object.values(dirty).some(page => 
      Object.values(page).some(section => section)
    );
  }, [dirty]);

  // Get dirty pages
  const dirtyPages = useMemo(() => {
    const pages: string[] = [];
    if (Object.values(dirty.home).some(Boolean)) pages.push("home");
    if (Object.values(dirty.plans).some(Boolean)) pages.push("plans");
    if (Object.values(dirty.contact).some(Boolean)) pages.push("contact");
    if (Object.values(dirty.policies).some(Boolean)) pages.push("policies");
    if (Object.values(dirty.settings).some(Boolean)) pages.push("settings");
    return pages;
  }, [dirty]);

  // Get dirty sections
  const dirtySections = useMemo(() => {
    const sections: { page: string; section: string }[] = [];
    Object.entries(dirty).forEach(([page, pageData]) => {
      Object.entries(pageData).forEach(([section, isDirty]) => {
        if (isDirty) sections.push({ page, section });
      });
    });
    return sections;
  }, [dirty]);

  // Save functions
  const savePage = useCallback(async (page: "home" | "plans" | "contact" | "policies" | "settings") => {
    const results: { page: string; section: string; success: boolean; error?: string }[] = [];
    let allSuccess = true;

    try {
      if (page === "home" && homeData) {
        const sectionsToSave = [];
        if (dirty.home.hero) sectionsToSave.push(["hero", homeData.hero]);
        if (dirty.home.featureSections) sectionsToSave.push(["featureSections", homeData.featureSections]);
        if (dirty.home.bentoFeatures) sectionsToSave.push(["bentoFeatures", homeData.bentoFeatures]);
        if (dirty.home.projectOverview) sectionsToSave.push(["projectOverview", homeData.projectOverview]);
        if (dirty.home.appSection) sectionsToSave.push(["appSection", homeData.appSection]);
        if (dirty.home.ctaSection) sectionsToSave.push(["ctaSection", homeData.ctaSection]);

        for (const [section, data] of sectionsToSave) {
          try {
            const sectionKey = String(section);
            const res = await fetch("/api/home-page", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ [sectionKey]: data }),
            });
            results.push({ page: "home", section: sectionKey, success: res.ok });
            if (!res.ok) allSuccess = false;
          } catch (e) {
            results.push({ page: "home", section: section as string, success: false, error: String(e) });
            allSuccess = false;
          }
        }
      }

      if (page === "plans" && plansData) {
        const sectionsToSave: [string, unknown][] = [];
        if (dirty.plans.hero) sectionsToSave.push(["hero", plansData.hero]);
        if (dirty.plans.compareRows) sectionsToSave.push(["compareRows", plansData.compareRows]);
        if (dirty.plans.faqItems) sectionsToSave.push(["faqItems", plansData.faqItems]);

        // Always send yearlyDiscountPercent alongside plans (or standalone if only discount changed)
        if (dirty.plans.plans || dirty.plans.yearlyDiscountPercent) {
          sectionsToSave.push(["plans", plansData.plans]);
          sectionsToSave.push(["yearlyDiscountPercent", plansData.yearlyDiscountPercent]);
        }

        for (const [section, data] of sectionsToSave) {
          const sectionKey = String(section);
          try {
            const res = await fetch("/api/plans-page", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ [sectionKey]: data }),
            });
            results.push({ page: "plans", section: sectionKey, success: res.ok });
            if (!res.ok) allSuccess = false;
          } catch (e) {
            results.push({ page: "plans", section: sectionKey, success: false, error: String(e) });
            allSuccess = false;
          }
        }
      }

      if (page === "contact" && contactData) {
        const sectionsToSave = [];
        if (dirty.contact.hero) sectionsToSave.push(["hero", contactData.hero]);
        if (dirty.contact.contactInfo) sectionsToSave.push(["contactInfo", contactData.contactInfo]);
        if (dirty.contact.channels) sectionsToSave.push(["channels", contactData.channels]);
        if (dirty.contact.inquiryOptions) sectionsToSave.push(["inquiryOptions", contactData.inquiryOptions]);
        if (dirty.contact.successMessage) sectionsToSave.push(["successMessage", contactData.successMessage]);
        if (dirty.contact.formFields) sectionsToSave.push(["formFields", contactData.formFields]);
        if (dirty.contact.thirdPartyFormScript || dirty.contact.formReplaced) {
          sectionsToSave.push(["formConfig", { thirdPartyFormScript: contactData.thirdPartyFormScript, formReplaced: contactData.formReplaced }]);
        }

        for (const [section, data] of sectionsToSave) {
          const sectionKey = String(section);
          try {
            const res = await fetch("/api/contact-page", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ [sectionKey]: data }),
            });
            results.push({ page: "contact", section: sectionKey, success: res.ok });
            if (!res.ok) allSuccess = false;
          } catch (e) {
            results.push({ page: "contact", section: sectionKey, success: false, error: String(e) });
            allSuccess = false;
          }
        }
      }

      if (page === "policies" && policiesData) {
        const types = ["privacy", "terms", "returns"] as const;
        for (const type of types) {
          if (dirty.policies[type]) {
            try {
              const res = await fetch(`/api/policies/${type}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(policiesData[type]),
              });
              results.push({ page: "policies", section: type, success: res.ok });
              if (!res.ok) allSuccess = false;
            } catch (e) {
              results.push({ page: "policies", section: type, success: false, error: String(e) });
              allSuccess = false;
            }
          }
        }
      }

      if (page === "settings" && settingsData) {
        const sectionsToSave: [string, unknown][] = [];
        if (dirty.settings.metadata) sectionsToSave.push(["siteTitle", settingsData.metadata.siteTitle]);
        if (dirty.settings.metadata) sectionsToSave.push(["siteDescription", settingsData.metadata.siteDescription]);
        if (dirty.settings.metadata) sectionsToSave.push(["faviconUrl", settingsData.metadata.faviconUrl]);
        if (dirty.settings.metadata) sectionsToSave.push(["logoUrl", settingsData.metadata.logoUrl]);
        if (dirty.settings.metadata) sectionsToSave.push(["seoKeywords", settingsData.metadata.seoKeywords]);
        if (dirty.settings.navLinks) sectionsToSave.push(["navLinks", settingsData.navLinks]);
        if (dirty.settings.footer) sectionsToSave.push(["footerColumns", settingsData.footer]);
        if (dirty.settings.social) sectionsToSave.push(["socialLinks", settingsData.social]);
        if (dirty.settings.apps) sectionsToSave.push(["appLinks", settingsData.apps]);
        if (dirty.settings.contact) sectionsToSave.push(["contactInfo", settingsData.contact]);
        if (dirty.settings.platform) sectionsToSave.push(["platformLinks", settingsData.platform]);
        if (dirty.settings.hours) sectionsToSave.push(["workHours", settingsData.hours]);

        // For settings, send all dirty sections in one request
        if (sectionsToSave.length > 0) {
          const body: Record<string, unknown> = {};
          sectionsToSave.forEach(([key, value]) => { body[key] = value; });
          try {
            const res = await fetch("/api/settings", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(body),
            });
            const success = res.ok;
            sectionsToSave.forEach(([key]) => {
              results.push({ page: "settings", section: key, success });
            });
            if (!success) allSuccess = false;
          } catch (e) {
            sectionsToSave.forEach(([key]) => {
              results.push({ page: "settings", section: key, success: false, error: String(e) });
            });
            allSuccess = false;
          }
        }
      }

      // Clear dirty for this page if all succeeded
      if (allSuccess) {
        setDirty(prev => ({ ...prev, [page]: Object.fromEntries(Object.entries(prev[page]).map(([k]) => [k, false])) } as DirtyState));
      }

      return allSuccess;
    } catch (e) {
      console.error(`Failed to save ${page}:`, e);
      return false;
    }
  }, [homeData, plansData, contactData, policiesData, settingsData, dirty]);

  const saveAll = useCallback(async () => {
    setIsSaving(true);
    const results: { page: string; section: string; success: boolean; error?: string }[] = [];
    
    try {
      const pagesToSave = ["home", "plans", "contact", "policies", "settings"] as const;
      
      for (const page of pagesToSave) {
        await savePage(page);
        // Note: savePage updates results internally
      }

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        setLastSaved(new Date().toLocaleTimeString("ar-SA"));
        setTimeout(() => setLastSaved(null), 5000);
      }

      return { success: allSuccess, results };
    } finally {
      setIsSaving(false);
    }
  }, [savePage]);

  // Reset functions
  const resetAll = useCallback(() => {
    setHomeDataState(originalData.home);
    setPlansDataState(originalData.plans);
    setContactDataState(originalData.contact);
    setPoliciesDataState(originalData.policies);
    setSettingsDataState(originalData.settings);
    setDirty({
      home: { hero: false, featureSections: false, bentoFeatures: false, projectOverview: false, appSection: false, ctaSection: false },
    plans: { hero: false, plans: false, compareRows: false, faqItems: false, yearlyDiscountPercent: false },
      contact: { hero: false, contactInfo: false, channels: false, inquiryOptions: false, successMessage: false, formFields: false, thirdPartyFormScript: false, formReplaced: false },
      policies: { privacy: false, terms: false, returns: false },
      settings: { metadata: false, navLinks: false, footer: false, social: false, apps: false, contact: false, platform: false, hours: false },
    });
  }, [originalData]);

  const discardChanges = useCallback(() => {
    resetAll();
  }, [resetAll]);

  // Navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const value = useMemo(() => ({
    homeData,
    plansData,
    contactData,
    policiesData,
    settingsData,
    loading,
    dirty,
    hasUnsavedChanges,
    dirtyPages,
    dirtySections,
    setHomeData,
    setPlansData,
    setContactData,
    setPoliciesData,
    setSettingsData,
    saveAll,
    savePage,
    isSaving,
    lastSaved,
    resetAll,
    discardChanges,
  }), [
    homeData, plansData, contactData, policiesData, settingsData,
    loading, dirty, hasUnsavedChanges, dirtyPages, dirtySections,
    setHomeData, setPlansData, setContactData, setPoliciesData, setSettingsData,
    saveAll, savePage, isSaving, lastSaved, resetAll, discardChanges,
  ]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
