interface TechStackSectionProps {
  techStack: string[];
}

export function TechStackSection({ techStack }: TechStackSectionProps) {
  return (
    <div className="px-4 py-5 border-b bg-zinc-50">
      <h3 className="font-semibold mb-3">기술 스택</h3>
      {techStack.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-sm bg-zinc-700 text-zinc-100 px-3 py-1 rounded-lg font-medium"
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
