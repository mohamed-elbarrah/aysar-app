import { Container } from "@/app/components/Container";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  note?: string;
}

export default function CTASection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  note,
}: CTASectionProps) {
  return (
    <section
      className="relative py-[120px] px-10 text-center overflow-hidden bg-[#F4F7FA]"
    >
      <Container className="relative z-[1] max-w-[680px] mx-auto">
        <h2
          className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] tracking-tight mb-[18px] text-[#08335D]"
          style={{ letterSpacing: "-0.2px" }}
        >
          {title}
        </h2>
        <p
          className="text-[18px] leading-[1.75] mb-9 text-[#7C8794]"
        >
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryCta && (
            <a
              href={primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-[16px] font-bold px-10 py-4 rounded-[13px] transition-all duration-150 hover:opacity-93 hover:-translate-y-0.5 bg-[#28C928] text-white"
            >
              {primaryCta.label}
            </a>
          )}
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-[15px] font-semibold px-8 py-4 rounded-[13px] border transition-colors duration-150 text-[#08335D] border-[#e8ebf3] hover:bg-white"
            >
              {secondaryCta.label}
            </a>
          )}
        </div>

        {note && (
          <p
            className="text-[13px] mt-4 text-[#7C8794]"
          >
            {note}
          </p>
        )}
      </Container>
    </section>
  );
}
