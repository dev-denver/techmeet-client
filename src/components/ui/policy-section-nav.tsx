interface PolicySection {
  id: string;
  label: string;
}

interface PolicySectionNavProps {
  sections: PolicySection[];
}

/** 약관/개인정보처리방침처럼 섹션이 많은 정적 문서에서 빠르게 원하는 섹션으로 이동하는 칩 내비게이션 */
export function PolicySectionNav({ sections }: PolicySectionNavProps) {
  return (
    <nav aria-label="섹션 바로가기" className="sticky top-14 z-40 bg-background border-b border-border">
      <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-2.5 [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent)]">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 inline-flex items-center h-[30px] px-3 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
