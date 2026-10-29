/** A streak counter with CHARETT's own green flame. */
export default function StreakFlame({
  count,
  label,
}: {
  count: number;
  label?: string;
}) {
  return (
    <span
      className="streak"
      role="img"
      aria-label={label ?? `${count}-day streak`}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M8.6 1.2c.3 2-.7 3.1-1.7 4.1C5.8 6.4 4.5 7.7 4.5 10a3.5 3.5 0 0 0 7 .3c.1-1.3-.4-2.3-1-3 .1.9-.2 1.7-.9 2 .3-2.4-.3-4.8-1-8.1Zm-.3 9.9c-.9 0-1.5-.6-1.5-1.4 0-.9.6-1.4 1.1-2 .1.8.6 1.2 1 1.6.4.4.7.8.7 1-.1.5-.6.8-1.3.8Z" />
      </svg>
      <span aria-hidden="true">{count}</span>
    </span>
  );
}
