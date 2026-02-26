import Image from "next/image";

export function HeroMap() {
  return (
    <Image
      src="/hero-map.jpg"
      alt=""
      fill
      priority
      style={{
        objectFit: "cover",
        filter: "brightness(0.7) sepia(0.2)",
      }}
    />
  );
}
