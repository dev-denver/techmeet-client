import { notFound } from "next/navigation";
import { MapPin, Clock, Users, Calendar, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectStatusBadge } from "@/components/features/projects/ProjectStatusBadge";
import { getProjectById } from "@/lib/supabase/queries/projects";
import { formatDate, formatBudget, formatDeadlineDays, formatWorkType } from "@/lib/utils/format";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const result = await getProjectById(id);

  if (!result) {
    notFound();
  }

  const { data: project } = result;

  return (
    <div className="pb-6">
      {/* 헤더 */}
      <div className="p-4 space-y-3 border-b">
        <div className="flex items-center gap-2">
          <ProjectStatusBadge status={project.status} />
          {project.status === "recruiting" && (
            <span className="text-xs text-muted-foreground">
              {formatDeadlineDays(project.deadline)}
            </span>
          )}
        </div>
        <h1 className="text-lg font-bold leading-snug">{project.title}</h1>
        <p className="text-sm text-muted-foreground">{project.clientName}</p>
      </div>

      {/* 기본 정보 */}
      <div className="p-4 space-y-3 border-b">
        <h2 className="font-semibold">프로젝트 정보</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Banknote className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">단가</p>
              <p className="font-medium text-xs">
                {formatBudget(project.budget.min, project.budget.max)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">근무 형태</p>
              <p className="font-medium text-xs">{formatWorkType(project.workType)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">기간</p>
              <p className="font-medium text-xs">
                {formatDate(project.duration.startDate)} ~{" "}
                {formatDate(project.duration.endDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">모집 인원</p>
              <p className="font-medium text-xs">{project.headcount}명</p>
            </div>
          </div>
          {project.location && (
            <div className="flex items-center gap-2 text-sm col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">위치</p>
                <p className="font-medium text-xs">{project.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="p-4 space-y-3 border-b">
        <h2 className="font-semibold">기술 스택</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* 프로젝트 설명 */}
      <div className="p-4 space-y-3 border-b">
        <h2 className="font-semibold">프로젝트 소개</h2>
        <p className="text-sm text-zinc-700 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* 자격 요건 */}
      <div className="p-4 space-y-3 border-b">
        <h2 className="font-semibold">자격 요건</h2>
        <ul className="space-y-2">
          {project.requirements.map((req, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-muted-foreground mt-0.5">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 지원 마감 */}
      <div className="p-4 border-b">
        <Card className="bg-zinc-50">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">지원 마감일</p>
              <p className="font-semibold text-sm">{formatDate(project.deadline)}</p>
            </div>
            <span className="text-sm font-medium text-orange-600">
              {formatDeadlineDays(project.deadline)}
            </span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* 지원하기 CTA */}
      <div className="p-4">
        {project.status === "recruiting" ? (
          <Button className="w-full h-12 text-base font-semibold">
            지원하기
          </Button>
        ) : (
          <Button className="w-full h-12 text-base font-semibold" disabled>
            {project.status === "in_progress" ? "진행 중인 프로젝트" : "모집 종료"}
          </Button>
        )}
      </div>
    </div>
  );
}
