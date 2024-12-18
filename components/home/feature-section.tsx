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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            Kenapa Memilih Skillopa?
          </h2>
          <p className="text-base font-sans text-muted-foreground max-w-2xl mx-auto">
            Platform pembelajaran yang dirancang untuk kesuksesan Anda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-sm 
              transition-all duration-300 
              hover:shadow-lg 
              hover:bg-primary/5 
              border border-transparent 
              hover:border-primary/20 
              group"
            >
              <div className="flex items-center mb-4">
                <feature.icon
                  className="w-8 h-8 text-primary mr-4 
                  transition-colors duration-300 
                  group-hover:text-primary/80"
                />
                <h3
                  className="text-xl font-heading font-medium text-card-foreground 
                transition-colors duration-300 
                group-hover:text-primary"
                >
                  {feature.title}
                </h3>
              </div>
              <p
                className="text-sm font-sans text-muted-foreground 
              transition-opacity duration-300 
              group-hover:opacity-80"
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
