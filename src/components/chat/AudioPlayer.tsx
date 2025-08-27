export default function AudioPlayer({ src }: { src: string }) {
  return (
    <audio controls className="w-full mt-2">
      <source src={src} type="audio/mpeg" />
    </audio>
  );
}
