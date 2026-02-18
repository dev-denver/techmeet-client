import { Badge } from "@/components/ui/badge";

interface TechStackSectionProps {
  techStack: string[];
}

export function TechStackSection({ techStack }: TechStackSectionProps) {
  return (
    <div className="p-4 border-b space-y-3">
      <h3 className="font-semibold">기술 스택</h3>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}
