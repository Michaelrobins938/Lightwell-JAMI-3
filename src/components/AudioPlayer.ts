export const AudioPlayer = {
  ctx: typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null,
  queue: [] as AudioBuffer[],
  analyserNode: null as AnalyserNode | null,

  initAnalyser() {
    if (!this.analyserNode && this.ctx) {
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.connect(this.ctx.destination);
    }
    return this.analyserNode;
  },

  async enqueue(base64: string) {
    try {
      if (!this.ctx) return;

      const buffer = await this.decode(base64);
      this.queue.push(buffer);
      if (this.queue.length === 1) this.playNext();
    } catch (err) {
      console.error("[AUDIO] enqueue failed", err);
    }
  },

  async decode(base64: string): Promise<AudioBuffer> {
    if (!this.ctx) throw new Error("AudioContext not initialized");
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return await this.ctx.decodeAudioData(array.buffer);
  },

  playNext() {
    if (!this.queue.length || !this.ctx) return;
    const buffer = this.queue.shift()!;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;

    const analyser = this.initAnalyser();
    if (analyser) src.connect(analyser);

    src.onended = () => this.playNext();

    if (this.ctx.state === "suspended") {
      this.ctx.resume().then(() => src.start());
    } else {
      src.start();
    }
  },

  playStream(stream: MediaStream) {
    if (!this.ctx) return;

    const audio = new Audio();
    audio.autoplay = true;
    audio.srcObject = stream;
    audio.play().catch(() => this.ctx?.resume());

    const analyser = this.initAnalyser();
    if (analyser) {
      const source = this.ctx.createMediaStreamSource(stream);
      source.connect(analyser);
    }
  },
};
