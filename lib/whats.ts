export function buildSummary(options: {
  name: string;
  username: string;
  phone: string;
  project: string;
  pkg: string;
  timestampISO: string;
}) {
  const lines = [
    `New Registration Summary`,
    `Name: ${options.name}`,
    `Username: ${options.username}`,
    `Phone: +${options.phone}`,
    `Project: ${options.project}`,
    `Package: ${options.pkg}`,
    `Time: ${options.timestampISO}`,
  ];
  return lines.join("\n");
}

export function whatsappUrl(num: string, text: string) {
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
