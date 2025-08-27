import Button from './Button';

const ctas = [
  { label: 'Start with Luna', aria: 'Start with Luna' },
  { label: 'I’m Done Being Alone', aria: 'I’m Done Being Alone' },
  { label: 'Enter the Quiet Space', aria: 'Enter the Quiet Space' },
];

export default function CTASection() {
  return (
    <section className="max-w-screen-md mx-auto px-6 py-16 flex flex-col items-center">
      <div className="w-full flex flex-col gap-6 items-center">
        {ctas.map((cta, i) => (
          <Button
            key={cta.label}
            variant="primary"
            aria-label={cta.aria}
            className="w-full max-w-xs text-lg py-4 shadow-lg rounded-full bg-white/80 text-gray-900 hover:bg-white/100 focus:ring-4 focus:ring-[#b39ddb] transition-all duration-200 neumorphic"
            style={{ animationDelay: `${i * 0.15}s` }}
            onClick={() => {
              if (typeof window !== "undefined" && Array.isArray((window as any).dataLayer)) {
                (window as any).dataLayer.push({ event: 'cta_click', label: cta.label });
              }
            }}
          >
            {cta.label}
          </Button>
        ))}
      </div>
    </section>
  );
} 