'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2 } from 'lucide-react';

interface CaseStudyFilmProps {
  src: string;
  poster: string;
  title: string;
  width: number;
  height: number;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

/**
 * The still holds the frame until the reader presses play, then the film takes
 * over inside a bespoke control bar — no browser chrome, no autoplay.
 */
export default function CaseStudyFilm({ src, poster, title, width, height }: CaseStudyFilmProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    setWaiting(true);
    const attempt = video.play();
    if (attempt) {
      attempt.then(() => setWaiting(false)).catch(() => setWaiting(false));
    }
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) play();
    else video.pause();
  }, [play]);

  const seek = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await container.requestFullscreen();
    } catch {
      /* fullscreen may be blocked — the control simply does nothing */
    }
  }, []);

  // Keep the player in sync with the element itself.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length) setBuffered(video.buffered.end(video.buffered.length - 1));
    };
    const onMeta = () => setDuration(video.duration || 0);
    const onPlay = () => { setPlaying(true); setStarted(true); setWaiting(false); };
    const onPause = () => setPlaying(false);
    const onReady = () => { setReady(true); setWaiting(false); };
    const onWaiting = () => setWaiting(true);
    const onVolume = () => setMuted(video.muted);
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));

    video.addEventListener('timeupdate', onTime);
    video.addEventListener('progress', onTime);
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('durationchange', onMeta);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('playing', onPlay);
    video.addEventListener('canplay', onReady);
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('volumechange', onVolume);
    document.addEventListener('fullscreenchange', onFullscreen);

    if (video.readyState >= 2) onReady();
    if (video.duration) onMeta();

    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('progress', onTime);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('durationchange', onMeta);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('playing', onPlay);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('volumechange', onVolume);
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, []);

  // Keyboard shortcuts, limited to the player itself.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    if (event.key === ' ' || event.key === 'k') {
      event.preventDefault();
      togglePlay();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      seek(Math.min(video.duration || 0, video.currentTime + 5));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seek(Math.max(0, video.currentTime - 5));
    } else if (event.key === 'm') {
      event.preventDefault();
      toggleMute();
    } else if (event.key === 'f') {
      event.preventDefault();
      void toggleFullscreen();
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration ? Math.min(100, (buffered / duration) * 100) : 0;

  return (
    <figure className="space-y-3">
      <div
        ref={containerRef}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-label={`${title} film player`}
        className="group/player relative w-full aspect-video overflow-hidden rounded-2xl border border-gold/20 bg-plum shadow-stage focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {/* The still carries the frame until play is pressed */}
        <Image
          src={poster}
          alt={`${title} — film still`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1152px"
          className={`object-cover object-center transition-opacity duration-700 ease-luxe ${
            started ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full bg-black object-contain transition-opacity duration-700 ease-luxe ${
            started ? 'opacity-100' : 'opacity-0'
          }`}
          src={src}
          poster={poster}
          width={width}
          height={height}
          preload="auto"
          loop
          playsInline
          onClick={togglePlay}
        />

        {/* Poster overlay — the invitation to press play */}
        {!started && (
          <button
            type="button"
            onClick={play}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/45 text-center transition-colors duration-500 hover:from-ink/75"
            aria-label={`Play the ${title} film`}
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold backdrop-blur-md transition-transform duration-500 ease-luxe group-hover/player:scale-105">
              <Play className="h-7 w-7 translate-x-0.5" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-parchment/85">
              Play film
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
              {title}
            </span>
          </button>
        )}

        {/* Loading veil */}
        {started && !playing && waiting && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/40 pointer-events-none">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        )}

        {/* ── Custom control bar ─────────────────────────────────────────── */}
        <div
          className={`absolute inset-x-0 bottom-0 z-30 px-3 pb-3 pt-10 sm:px-4 sm:pb-4 transition-opacity duration-500 ${
            started ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ background: 'linear-gradient(to top, rgba(7,6,11,0.92) 0%, rgba(7,6,11,0.55) 45%, transparent 100%)' }}
        >
          {/* Scrubber */}
          <div className="relative mb-2.5 h-4">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full bg-white/20" style={{ width: `${bufferedPercent}%` }} />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gold-sheen shadow-[0_0_10px_rgba(212,167,44,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={currentTime}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label="Seek through the film"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              className="absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent accent-gold"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? 'Pause film' : 'Play film'}
              className="flex h-9 w-9 items-center justify-center rounded-full text-parchment transition-colors duration-300 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
            </button>

            <span className="font-mono text-[11px] tabular-nums tracking-wide text-parchment/85">
              {formatTime(currentTime)}
              <span className="text-smoke"> / {formatTime(duration)}</span>
            </span>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute film' : 'Mute film'}
                aria-pressed={muted}
                className="flex h-9 w-9 items-center justify-center rounded-full text-parchment transition-colors duration-300 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'}
                className="flex h-9 w-9 items-center justify-center rounded-full text-parchment transition-colors duration-300 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold"
              >
                {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
        {title} — AI film · 16 seconds{ready ? '' : ' · loading'} · press play
      </figcaption>
    </figure>
  );
}
