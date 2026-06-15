export function WhatsAppShareButton({ text }: { text: string }) {
  const href = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#07150b] transition hover:bg-[#37df75]"
    >
      WhatsApp'ta paylaş
    </a>
  );
}
