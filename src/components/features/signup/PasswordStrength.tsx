export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { label: "8자 이상", ok: password.length >= 8 },
    { label: "소문자", ok: /[a-z]/.test(password) },
    { label: "숫자", ok: /[0-9]/.test(password) },
    { label: "특수문자", ok: /[!@#$%^&*()_+\-=]/.test(password) },
  ];

  const passCount = checks.filter((c) => c.ok).length;
  const strengthLabel = passCount <= 1 ? "약함" : passCount <= 3 ? "보통" : "강함";
  const strengthColor =
    passCount <= 1 ? "bg-red-500" : passCount <= 3 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="space-y-2 pt-0.5">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${strengthColor}`}
            style={{ width: `${(passCount / checks.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500 w-6 text-right">{strengthLabel}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-xs px-1.5 py-0.5 rounded ${c.ok ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"
              }`}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
