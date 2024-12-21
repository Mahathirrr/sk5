import Image from "next/image";

export function LoginFeatures() {
  return (
    <div className="hidden lg:block relative w-full h-screen bg-muted">
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/30 z-10" />
      <Image
        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
        alt="Students collaborating in modern learning environment"
        className="object-cover object-center"
        priority
        quality={100}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  );
}
