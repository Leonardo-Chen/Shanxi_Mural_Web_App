type ResearchStatusNoteProps = {
  text: string;
};

export default function ResearchStatusNote({ text }: ResearchStatusNoteProps) {
  return (
    <p className="font-sans text-[11px] leading-relaxed text-stone/75">{text}</p>
  );
}
