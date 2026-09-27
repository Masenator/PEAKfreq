import { evidence } from "@/data/taxonomy";
import type { EvidenceGrade } from "@/data/types";

export function Evidence({ grade, compact = false }: { grade: EvidenceGrade; compact?: boolean }) {
  const e = evidence[grade];
  return (
    <span className={`grade grade--${grade} ${compact ? "chip" : ""}`} title={`Evidence grade ${grade}: ${e.copy}`} style={compact ? { paddingLeft: 3, background: "var(--paper)", borderColor: "transparent" } : undefined}>
      <span className="grade__mark" style={compact ? { width: 20, height: 20, fontSize: 11 } : undefined}>
        {grade}
      </span>
      <span className="grade__label">{compact ? "Evidence" : `Evidence grade · ${e.label}`}</span>
    </span>
  );
}
