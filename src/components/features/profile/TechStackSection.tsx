interface TechStackSectionProps {
  techStack: string[];
}

export function TechStackSection({ techStack }: TechStackSectionProps) {
  return (
    <div className="px-4 py-5 border-b bg-muted/30">
      <h3 className="font-semibold mb-3">기술 스택</h3>
      {techStack.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-lg font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">등록된 기술 스택이 없습니다.</p>
      )}
    </div>
  );
}
