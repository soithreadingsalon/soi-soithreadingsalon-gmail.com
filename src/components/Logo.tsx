import logoImg from "@/assets/soi-logo.png";

export function Logo({ className = "h-12 w-auto", invert = false }: { className?: string; invert?: boolean }) {
  return (
    <img
      src={logoImg}
      alt="SOI Threading Salon"
      className={`${className} object-contain`}
      style={invert ? { filter: "invert(1) brightness(2)" } : undefined}
    />
  );
}