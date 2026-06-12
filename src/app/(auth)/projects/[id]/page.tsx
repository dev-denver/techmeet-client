import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Users, Calendar, Check, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge } from "@/components/features/projects/ProjectStatusBadge";
import { ApplyButton } from "@/components/features/projects/ApplyButton";
import { ShareButton } from "@/components/features/projects/ShareButton";
import { RecordRecentProject } from "@/components/features/projects/RecordRecentProject";
import { getProjectById } from "@/lib/supabase/queries/projects";
import { getApplicationForProject } from "@/lib/supabase/queries/applications";
import { getProfile } from "@/lib/supabase/queries/profile";
import { formatDate, formatDeadlineDays, getDeadlineDays, formatWorkType } from "@/lib/utils/format";
import { getMySkills, getMatchedSkillSet } from "@/lib/utils/skills";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { ApplicationStatus, ProjectStatus } from "@/types";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const [result, myApplication, profileResult] = await Promise.all([
    getProjectById(id),
    getApplicationForProject(id),
    getProfile(),
  ]);
  // getProfile()이 이미 인증 사용자 기준으로 조회하므로 별도 auth.getUser() 호출 불필요
  const currentUserId = profileResult?.data.id ?? null;

  if (!result) notFound();

  const { data: project } = result;
  const mySkills = profileResult?.data ? getMySkills(profileResult.data) : [];
  const matchedSkills = getMatchedSkillSet(project.techStack, mySkills);
  const matchCount = matchedSkills.size;
  const isRecruiting = project.status === ProjectStatus.Recruiting;
  const deadlineText = formatDeadlineDays(project.deadline);
  const deadlineDays = getDeadlineDays(project.deadline);
  const isUrgent = isRecruiting && deadlineDays !== null && deadlineDays <= 7;
  const isExpired = deadlineText === "마감";
  const deadlinePassed = !!project.deadline && getDeadlineDays(project.deadline) === null;

  const appConfig = myApplication ? APPLICATION_STATUS_CONFIG[myApplication.status] : null;
  const isWithdrawn = myApplication?.status === ApplicationStatus.Withdrawn;

  return (
    <div>
      {/* 최근 본 프로젝트 기록 (렌더 없음) */}
      <RecordRecentProject id={project.id} title={project.title} />

      {/* 히어로 */}
      <div className="bg-primary px-5 pt-6 pb-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <ProjectStatusBadge status={project.status} />
          <div className="flex items-center gap-2">
            {isRecruiting && deadlineText && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isUrgent
                    ? "bg-status-danger/25 text-status-danger"
                    : "bg-primary-foreground/10 text-primary-foreground/60"
                }`}
              >
                {deadlineText}
              </span>
            )}
            {currentUserId && (
              <ShareButton
                projectId={project.id}
                userId={currentUserId}
                className="border-primary-foreground/20 text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
              />
            )}
          </div>
        </div>

        <h1 className="text-primary-foreground text-xl font-bold leading-snug">{project.title}</h1>
        {project.clientName && (
          <p className="text-primary-foreground/50 text-sm mt-1.5">{project.clientName}</p>
        )}

        {/* 핵심 정보 chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.workType && (
            <span className="flex items-center gap-1.5 text-xs text-primary-foreground/70 bg-primary-foreground/10 border border-primary-foreground/15 px-3 py-1.5 rounded-full">
              <Clock className="h-3 w-3" />
              {formatWorkType(project.workType)}
            </span>
          )}
          {project.location && (
            <span className="flex items-center gap-1.5 text-xs text-primary-foreground/70 bg-primary-foreground/10 border border-primary-foreground/15 px-3 py-1.5 rounded-full">
              <MapPin className="h-3 w-3" />
              {project.location}
            </span>
          )}
          {project.headcount !== null && (
            <span className="flex items-center gap-1.5 text-xs text-primary-foreground/70 bg-primary-foreground/10 border border-primary-foreground/15 px-3 py-1.5 rounded-full">
              <Users className="h-3 w-3" />
              {project.headcount}명 모집
            </span>
          )}
          {(project.duration.startDate || project.duration.endDate) && (
            <span className="flex items-center gap-1.5 text-xs text-primary-foreground/70 bg-primary-foreground/10 border border-primary-foreground/15 px-3 py-1.5 rounded-full">
              <Calendar className="h-3 w-3" />
              {formatDate(project.duration.startDate)} ~ {formatDate(project.duration.endDate)}
            </span>
          )}
        </div>
      </div>

      {/* 기술 스택 */}
      {project.techStack.length > 0 && (
        <div className="px-4 py-5 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">요구 기술 스택</h2>
            {matchCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-status-success">
                <Sparkles className="h-3.5 w-3.5" />
                내 기술 {matchCount}개 일치
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => {
              const matched = matchedSkills.has(tech);
              return (
                <span
                  key={tech}
                  className={cn(
                    "flex items-center gap-1 text-sm px-3 py-1 rounded-lg font-medium",
                    matched
                      ? "bg-status-success/15 text-status-success border border-status-success/30"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {matched && <Check className="h-3.5 w-3.5" />}
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 프로젝트 소개 */}
      {project.description && (
        <div className="px-4 py-5 border-b bg-muted/30">
          <h2 className="font-semibold mb-3">프로젝트 소개</h2>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      )}

      {/* 자격 요건 */}
      {project.requirements && project.requirements.length > 0 && (
        <div className="px-4 py-5 border-b">
          <h2 className="font-semibold mb-3">자격 요건</h2>
          <ul className="space-y-2.5">
            {project.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-1.5" />
                <span className="text-foreground/80">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 마감일 */}
      {project.deadline && (
        <div className="px-5 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">지원 마감일</p>
              <p className="text-sm font-semibold text-foreground">{formatDate(project.deadline)}</p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                isExpired
                  ? "bg-muted text-muted-foreground"
                  : isUrgent
                  ? "bg-status-danger/10 text-status-danger"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {deadlineText}
            </span>
          </div>
        </div>
      )}

      {/* CTA 높이만큼 하단 여백 확보 */}
      <div className="h-20" />

      {/* CTA - BottomNav 바로 위에 고정 */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-30 bg-background border-t border-border px-4 py-3">
        {myApplication && !isWithdrawn ? (
          <Link
            href="/projects/applications"
            className="flex w-full h-12 items-center justify-center gap-2 rounded-md border border-border bg-muted/60 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Check className="h-4 w-4 text-status-success" />
            지원 완료
            {appConfig && (
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", appConfig.className)}>
                {appConfig.label}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>
        ) : isRecruiting && !deadlinePassed ? (
          <ApplyButton projectId={project.id} />
        ) : myApplication ? (
          <Link
            href="/projects/applications"
            className="flex w-full h-12 items-center justify-center gap-2 rounded-md border border-border bg-muted/60 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>지원을 취소한 프로젝트입니다</span>
            {appConfig && (
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", appConfig.className)}>
                {appConfig.label}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>
        ) : (
          <Button className="w-full h-12 text-base font-semibold" disabled>
            {!isRecruiting
              ? project.status === ProjectStatus.InProgress
                ? "진행 중인 프로젝트"
                : "모집 종료"
              : "지원 마감"}
          </Button>
        )}
      </div>
    </div>
  );
}
