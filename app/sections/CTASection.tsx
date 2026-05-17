import { Container } from "@/app/components/Container";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  note?: string;
  variant?: "dark" | "light";
}

export default function CTASection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  note,
  variant = "dark",
}: CTASectionProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={`relative py-[120px] px-6 text-center overflow-hidden ${
        isDark ? "gradient-hero" : "bg-white"
      }`}
    >
      {/* Background glow */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark
            ? "bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(45,46,131,0.06),transparent)]"
            : ""
        }`}
      />

      <Container className="relative z-[1] max-w-[680px] mx-auto">
        <h2
          className={`text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] tracking-tight mb-5 ${
            isDark ? "text-white" : "text-[#0c1829]"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-lg leading-[1.7] mb-9 ${
            isDark ? "text-white/55" : "text-[#6b7a94]"
          }`}
        >
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryCta && (
            <a
              href={primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 text-base font-bold px-10 py-4 rounded-[13px] transition-all duration-150 hover:opacity-93 hover:-translate-y-0.5 ${
                isDark
                  ? "bg-[#0c2954] text-white"
                  : "bg-white text-[#0c2954]"
              }`}
            >
              {primaryCta.label}
            </a>
          )}
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 text-[15px] font-semibold px-8 py-4 rounded-[13px] border transition-colors duration-150 ${
                isDark
                  ? "bg-[rgba(37,211,102,0.08)] text-[#1a7a3a] border-[rgba(37,211,102,0.2)] hover:bg-[rgba(37,211,102,0.14)]"
                  : "text-[#0c2954] border-[#e8edf5] hover:bg-[#f7f8fa]"
              }`}
            >
              {secondaryCta.label}
            </a>
          )}
        </div>

        {note && (
          <p
            className={`text-sm mt-4 ${
              isDark ? "text-white/35" : "text-[#6b7a94]"
            }`}
          >
            {note}
          </p>
        )}
      </Container>
    </section>
  );
}
