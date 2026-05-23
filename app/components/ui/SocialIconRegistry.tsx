"use client";

import Image from "next/image";
import { X, Phone, Mail, MapPin, Clock, Globe } from "lucide-react";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";
import { InstagramIcon } from "@/app/components/icons/InstagramIcon";
import { TikTokIcon } from "@/app/components/icons/TikTokIcon";

type IconComponent = React.FC<{ className?: string }>;

export const BUILT_IN_SOCIAL_ICONS: Record<string, IconComponent> = {
  x: X,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

export const CONTACT_ICONS: Record<string, IconComponent> = {
  whatsapp: WhatsAppIcon,
  phone: Phone,
  email: Mail,
  location: MapPin,
  hours: Clock,
  support: Globe,
};

function ImageIcon({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <Image
        src={src}
        alt={alt}
        width={20}
        height={20}
        className="object-contain"
        unoptimized
      />
    </span>
  );
}

export function resolveSocialIcon(key: string, iconUrl?: string): IconComponent {
  if (iconUrl) {
    const ImgComp: IconComponent = ({ className }) => (
      <ImageIcon src={iconUrl} alt={key} className={className} />
    );
    ImgComp.displayName = `SocialIcon_${key}`;
    return ImgComp;
  }
  return BUILT_IN_SOCIAL_ICONS[key] || Globe;
}