export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? "text-center mx-auto max-w-2xl" : ""}`}>
      {eyebrow && (
        <p className="font-script text-2xl text-gold mb-2">{eyebrow}</p>
      )}
      <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{subtitle}</p>}
      <div className={`mt-5 ornament-divider ${center ? "max-w-[180px] mx-auto" : "max-w-[120px]"}`}>
        <span className="text-base">✦</span>
      </div>
    </div>
  );
}