import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import {
  Instagram,
  Github,
  MessageCircle,
  Phone,
  ChevronRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/10 py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 md:flex-row">
        {/* Logo and Description */}
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        <p className="text-muted-foreground text-center md:text-left">
          © {currentYear} Skillopa. Developed by Muhammad Mahathir
        </p>

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <Link
            href="/privacy"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <span>Kebijakan Privasi</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/terms"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <span>Syarat & Ketentuan</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Contact Icons */}
        <div className="flex gap-4">
          <Link
            href="https://www.instagram.com/emhaa._/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="h-6 w-6" />
          </Link>
          <Link
            href="https://github.com/Mahathirrr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-6 w-6" />
          </Link>
          <Link
            href="https://discord.com/users/455894462699274241"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
          </Link>
          <Link
            href="https://wa.me/+6281397181617"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
