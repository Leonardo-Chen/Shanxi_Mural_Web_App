"use client";

interface CompletionDialogProps {
  open: boolean;
  lowCompletion: boolean;
  onContinue: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CompletionDialog({
  open,
  lowCompletion,
  onContinue,
  onConfirm,
  onClose,
}: CompletionDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-sm border border-ink/10 bg-rice p-6 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="completion-title" className="font-serif text-lg text-ink">
          {lowCompletion ? "尚未完成全部区域" : "完成上色"}
        </h3>
        <p className="mt-3 font-serif text-sm leading-relaxed text-ink/70">
          {lowCompletion
            ? "还有一些区域尚未着色，仍然提交吗？"
            : "确认提交当前作品并与原壁画比较？"}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 rounded-sm border border-ink/15 px-4 py-2.5 font-sans text-xs tracking-wide text-ink hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            继续上色
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-sm bg-cinnabar px-4 py-2.5 font-sans text-xs tracking-wide text-rice hover:bg-cinnabar/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            仍然完成
          </button>
        </div>
      </div>
    </div>
  );
}
