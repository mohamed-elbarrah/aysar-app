import { Container } from "@/app/components/Container";
import { Badge } from "@/app/components/ui/Badge";
import { ReactNode } from "react";

interface PlansHeroSectionProps {
  badge: string;
  title: string;
  titleAccent: string;
  accentColor?: string;
  accentOpacity?: number;
  subtitle: string;
  toggle?: ReactNode;
}

export function PlansHeroSection({
  badge,
  title,
  titleAccent,
  accentColor,
  accentOpacity,
  subtitle,
  toggle,
}: PlansHeroSectionProps) {
  return (
    <section className="relative gradient-hero pt-[130px] pb-20 px-6 lg:px-10 text-center overflow-hidden noise-overlay">
      <div className="glow-orb glow-orb-indigo w-[600px] h-[400px] -top-[100px] left-1/2 -translate-x-1/2" />
      <Container className="relative z-[1] max-w-[680px] mx-auto">
        <div className="anim-fade-in-up mb-2">
          <Badge>{badge}</Badge>
        </div>
        <h1 className="text-[clamp(32px,5vw,56px)] font-bold text-white leading-[1.12] tracking-tight mb-4 anim-fade-in-up anim-delay-1">
          {title}<br />
          <span className="font-bold leading-[1.12] tracking-tight" style={{ color: accentColor || '#ffffff', opacity: accentOpacity !== undefined ? accentOpacity : 0.5 }}>{titleAccent}</span>
        </h1>
        <p className="text-[17px] text-white/50 leading-[1.75] mb-9 max-w-[580px] mx-auto anim-fade-in-up anim-delay-2">
          {subtitle}
        </p>
        {toggle && <div className="anim-fade-in-up anim-delay-3">{toggle}</div>}
      </Container>
    </section>
  );
}
