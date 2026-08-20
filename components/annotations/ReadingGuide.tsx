type ReadingGuideProps = {
  steps: string[];
};

export default function ReadingGuide({ steps }: ReadingGuideProps) {
  if (!steps.length) return null;

  return (
    <ol className="space-y-1.5">
      {steps.map((step, index) => (
        <li
          key={`${index}-${step}`}
          className="flex gap-2 font-serif text-sm leading-relaxed text-ink/70"
        >
          <span className="mt-0.5 shrink-0 font-sans text-[10px] tracking-[0.12em] text-stone/55">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}
