import type { CSSProperties } from "react";

const WHATSAPP_NUMBER = "15513013894"; // +1 551-301-3894
const DEFAULT_MESSAGE = "Hi SOI Threading Salon, I'd like to book an appointment.";

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.78 3.41 4.74 4.34.616.287 2.035.973 2.694.973.59 0 1.32-.302 1.575-.945.075-.187.5-.972.5-1.276s-2.063-1.247-2.42-1.247zM16.97 30.595c-3.026 0-5.96-.86-8.477-2.595L1 30l2.34-7.336c-1.91-2.55-2.86-5.59-2.84-8.79.014-7.847 6.42-14.252 14.27-14.252 3.808.014 7.385 1.49 10.07 4.187a14.067 14.067 0 0 1 4.16 10.064c-.014 7.847-6.42 14.253-14.27 14.253-.014 0-.014 0 0 0z"/>
    </svg>
  );
}

type Props = {
  className?: string;
  style?: CSSProperties;
  label?: string;
  message?: string;
  showIcon?: boolean;
};

export function WhatsAppButton({
  className = "",
  style,
  label = "WhatsApp",
  message = DEFAULT_MESSAGE,
  showIcon = true,
}: Props) {
  const href = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp at 551-301-3894`}
      className={className}
      style={style}
    >
      {showIcon && <WhatsAppIcon className="h-4 w-4" />}
      {label}
    </a>
  );
}

export const WHATSAPP_DISPLAY = "551-301-3894";
export const WHATSAPP_HREF = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;