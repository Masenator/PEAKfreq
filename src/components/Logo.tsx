import { brand } from "@/data/brand";
import { LogoMark } from "./LogoMark";

export function Logo({ id = "pf-logo" }: { id?: string }) {
  return (
    <span className="logo">
      <LogoMark height={26} id={id} strokeWidth={7} />
      <span className="logo__word">
        <b>{brand.wordmark.strong}</b>
        <i>{brand.wordmark.light}</i>
      </span>
    </span>
  );
}
