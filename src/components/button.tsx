import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "sm" | "lg";
const sizeMap: Record<string, string> = {
  sm: "btn--sm",
  lg: "btn--lg",
};

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

interface LinkProps extends BaseProps {
  href: string;
  type?: never;
  onClick?: never;
}
interface BtnProps extends BaseProps {
  href?: never;
  type?: "button" | "submit";
  onClick?: () => void;
}

export function Button(props: LinkProps | BtnProps) {
  const cls = [
    "btn",
    props.variant === "primary" ? "btn--primary" : "",
    props.variant === "ghost" ? "btn--ghost" : "",
    typeof props.variant === "string" && sizeMap[props.variant] ? sizeMap[props.variant] : "",
    props.className ?? "",
  ].filter(Boolean).join(" ");

  if ("href" in props && props.href) {
    return <Link href={props.href} className={cls}>{props.children}</Link>;
  }
  return (
    <button
      type={props.type ?? "button"}
      className={cls}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export const btnCss = `
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  border: 1px solid transparent;
  transition: transform .25s var(--ease-out-soft), background .25s var(--ease-out-soft),
              color .25s var(--ease-out-soft), border-color .25s var(--ease-out-soft);
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
}
.btn--primary { background: #1a1714; color: #faf6ee; }
.btn--primary:hover { background: #6f542f; transform: translateY(-1px); }
.btn--primary:active { transform: translateY(0); }
.btn--ghost {
  background: transparent;
  color: #1a1714;
  border-color: rgba(26,23,20,0.12);
}
.btn--ghost:hover { background: #1a1714; color: #faf6ee; border-color: #1a1714; }
.btn--sm { padding: 11px 18px; font-size: 13px; }
.btn--lg { padding: 16px 26px; font-size: 15px; }
`;
