import { Badge } from "@/components/ui/badge";
import { CareerTimelineDot } from "@/components/features/profile/CareerTimelineDot";
import { formatMonthYear } from "@/lib/utils/format";
import type { Career } from "@/types";

interface CareerSectionProps {
  careers: Career[];
}

export function CareerSection({ careers }: CareerSectionProps) {
  return (
    <div className="p-4 border-b space-y-4">
      <h3 className="font-semibold">경력</h3>
      <div className="space-y-4">
        {careers.map((career, idx) => (
          <div key={career.id} className="relative flex gap-4">
            {/* 타임라인 선 */}
            <CareerTimelineDot
              isCurrent={career.isCurrent}
              isLast={idx === careers.length - 1}
            />

            {/* 내용 */}
            <div className="flex-1 pb-4 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">{career.role}</p>
                  <p className="text-sm text-muted-foreground">{career.company}</p>
                </div>
                {career.isCurrent && (
                  <Badge className="text-xs bg-primary/10 text-primary border-primary/20 shrink-0">
                    현재
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatMonthYear(career.startDate)} ~{" "}
                {career.isCurrent ? "현재" : career.endDate ? formatMonthYear(career.endDate) : ""}
              </p>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {career.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {career.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
