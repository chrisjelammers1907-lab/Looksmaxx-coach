/** The CHARETT mark: a serif C in a hairline circle. */
export default function Monogram({ size = 40 }: { size?: number }) {
  return (
    <svg
      className="monogram"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19.25" fill="none" strokeWidth="1" />
      <text
        x="20"
        y="27.5"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize="22"
        fontWeight="500"
      >
        C
      </text>
    </svg>
  );
}
