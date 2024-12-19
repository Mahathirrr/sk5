"use client";

import { Button } from "@/components/ui/button";
import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto py-24 md:py-32">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Belajar Skill Baru dari{" "}
              <span className="text-primary">Para Ahli</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Platform pembelajaran online terbaik dengan instruktur
              berkualitas. Tingkatkan keahlianmu dan raih kesuksesan karir.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" className="gap-2">
                  <BookOpenCheck className="h-5 w-5" />
                  Mulai Belajar
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/20 to-transparent" />
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80"
              alt="Students learning"
              width={1771}
              height={1000}
              className="rounded-3xl object-cover shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
