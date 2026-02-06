interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="prompt" className="block text-sm font-medium text-foreground">
        UI 설명 입력
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="예시: 이메일과 비밀번호를 입력받는 로그인 페이지를 만들어주세요"
        className="w-full min-h-[120px] p-4 border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <p className="text-xs text-muted-foreground">
        만들고 싶은 UI를 자연어로 설명해주세요. 예: "사용자 목록을 보여주는 대시보드", "로그인 폼"
      </p>
    </div>
  );
}
