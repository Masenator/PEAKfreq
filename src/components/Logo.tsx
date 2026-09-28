import { brand } from "@/data/brand";
import { LogoMark } from "./LogoMark";
import { Wordmark } from "./Wordmark";

export function Logo({ id = "pf-logo" }: { id?: string }) {
  return (
    <span className="logo" aria-label={brand.name}>
      <LogoMark height={26} id={id} strokeWidth={7} />
      <Wordmark height={27} id={`${id}-wm`} className="logo__wordmark" />
    </span>
  );
}
