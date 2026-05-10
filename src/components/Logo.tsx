import logoImg from "@/assets/soi-logo.png";

export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="SOI Threading Salon"
      className={`${className} object-contain`}
    />
  );
}