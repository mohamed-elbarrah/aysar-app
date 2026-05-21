import { Container } from "@/app/components/Container";
import { Button } from "@/app/components/ui/Button";
import { ReactNode } from "react";

interface HeroProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showNoise?: boolean;
  children?: ReactNode;
}

export default function HeroSection({
  badge,
  title,
  titleAccent,
  subtitle,
  primaryCta,
  secondaryCta,
  showNoise = true,
  children,
}: HeroProps) {
  return (
    <section className={`relative min-h-[100dvh] gradient-hero flex flex-col items-center pt-[100px] pb-0 px-6 lg:px-10 overflow-hidden ${showNoise ? "noise-overlay" : ""}`}>
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-indigo w-[700px] h-[500px] -top-[100px] -right-[100px]" />
      <div className="glow-orb glow-orb-navy w-[500px] h-[400px] bottom-[200px] -left-20" />
      <div className="glow-orb glow-orb-mint w-[300px] h-[300px] top-[200px] left-1/2 -translate-x-1/2" />

      <Container className="relative z-[1] pt-0 pb-8 lg:pb-[52px]">
        <div className="text-center max-w-[760px] mx-auto">
          {badge && (
            <div className="badge anim-fade-in-up">
              <span className="badge-dot anim-pulse" />
              {badge}
            </div>
          )}

          <h1 className="text-[clamp(28px,3.8vw,52px)] font-bold text-white leading-[1.15] tracking-tight mb-6 anim-fade-in-up anim-delay-1">
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="bg-gradient-to-br from-white to-white/55 bg-clip-text text-transparent">
                  {titleAccent}
                </span>
              </>
            )}
          </h1>

          <p className="text-[clamp(16px,2vw,20px)] text-white/50 leading-[1.75] max-w-[580px] mx-auto mb-10 anim-fade-in-up anim-delay-2">
            {subtitle}
          </p>

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center justify-center gap-3 anim-fade-in-up anim-delay-3">
              {primaryCta && (
                <Button variant="primary" href={primaryCta.href}>
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button variant="secondary" href={secondaryCta.href}>
                  {secondaryCta.label}
                  <span>←</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Child content (e.g. mockup) - full width on mobile, container on lg */}
      {children && (
        <div className="relative z-[1] mt-12 w-full">
          {children}
        </div>
      )}
    </section>
  );
}
