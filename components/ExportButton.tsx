// components/ExportButton.tsx
type Props = { packageId: string };

export default function ExportButton({ packageId }: Props) {
  return (
    <a
      href={`/api/packages/${packageId}/downlines/export`}
      className="g-btn"
      // optional: lets the browser suggest a filename; server still sets real name
      download
    >
      Export Downlines as CSV
    </a>
  );
}
