import { GraduationCap, Users, Star } from "lucide-react";

const features = [
  {
    title: "Instruktur Berkualitas",
    description:
      "Belajar langsung dari para ahli di bidangnya dengan pengalaman industri yang luas.",
    icon: GraduationCap,
  },
  {
    title: "Komunitas Aktif",
    description:
      "Bergabung dengan komunitas pembelajar yang aktif dan saling mendukung.",
    icon: Users,
  },
  {
    title: "Materi Berkualitas",
    description:
      "Kurikulum yang dirancang khusus dan selalu diperbarui mengikuti perkembangan industri.",
    icon: Star,
  },
];

export function FeatureSection() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Kenapa Memilih Skillopa?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Platform pembelajaran yang dirancang untuk kesuksesan Anda
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
