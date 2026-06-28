export default function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,213,79,0.1) 30%, rgba(255,213,79,0.1) 70%, transparent 100%)',
        }}
      />
    </div>
  )
}
