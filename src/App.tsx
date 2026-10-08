import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Headphones, Send, Share2, Youtube } from "lucide-react";

// Placeholder assets - could be replaced with actual assets
const SONG_NAME = "කැමති නැද්ද";
const ARTIST_NAME = "Malshan Ranawella";
const HERO_BG = "/Just U And Me🩷.jpg";
const AUDIO_SRC = "/kamathi_nadda.mp3";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzslC6fDf04BVEOOrmZgXpYLavCkqDM0Yk3aEU71Dwypvp8EhkaE6MxTX7W87OeixUaCA/exec";

export default function MusicInvitation() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // One word state
  const [oneWord, setOneWord] = useState("");
  const [wordSubmitted, setWordSubmitted] = useState(false);

  // Fake comments
  const [comments, setComments] = useState([
    { name: "Nethmi", text: "ගීතය අහද්දි හිතට පුදුම සැනසීමක් දැනුනා. ❤️", id: 1 },
    { name: "Kavindu", text: "මේක අහද්දි මට පරණ මතකයක් මතක් වුණා...", id: 2 },
    { name: "Sarah", text: "හරිම ලස්සන calm vibe එකක් තියෙන්නේ. 🎧", id: 3 }
  ]);

  const [words, setWords] = useState(["සැනසීම", "ආදරය", "මතක", "නිදහස", "හීනය"]);

  const openInvitation = () => {
    setIsOpened(true);
    // Try to play music automatically
    setTimeout(() => {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.log("Audio autoplay blocked:", error);
              setIsPlaying(false);
            });
        }
      }
    }, 500);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setIsSubmitting(true);
    try {
      if (GOOGLE_SCRIPT_URL !== "YOUR_WEB_APP_URL_HERE") {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formName: "messages", name, message })
        });
      }
      setComments([{ name, text: message, id: Date.now() }, ...comments]);
      setIsSubmitted(true);
      setName("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting message:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitOneWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oneWord) return;

    setIsSubmitting(true);
    try {
      if (GOOGLE_SCRIPT_URL !== "YOUR_WEB_APP_URL_HERE") {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formName: "oneword", word: oneWord })
        });
      }
      setWords([oneWord, ...words.slice(0, 7)]);
      setWordSubmitted(true);
    } catch (err) {
      console.error("Error submitting word:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] text-[#4A443D] font-sinhala-sans overflow-x-hidden selection:bg-[#D2D6C9] selection:text-[#4A443D] relative">
      <div className="texture-overlay"></div>

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              transition: { duration: 1, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden cursor-pointer"
            onClick={openInvitation}
          >
            <video
              autoPlay
              muted
              playsInline
              onEnded={openInvitation}
              className="w-full h-full object-cover"
              src="/intro.mp4"
            />
            <div className="absolute inset-0 bg-black/20" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-white/70 animate-pulse">
                Tap to open
              </span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full"
          >
            <audio
              ref={audioRef}
              src={AUDIO_SRC}
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Persistent Audio Controls when playing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 right-6 z-50 glass-button px-4 py-2 rounded-full flex items-center gap-3 shadow-sm"
            >
              <div className={`animate-waveform scale-75 ${!isPlaying ? 'opacity-30' : ''}`}>
                <div className="waveform-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></div>
                <div className="waveform-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></div>
                <div className="waveform-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></div>
              </div>
              <button onClick={togglePlay} className="text-[#8C7C6B] hover:text-[#4A443D] transition-colors">
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
            </motion.div>

            {/* HERO SECTION */}
            <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center p-6 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src={HERO_BG} alt="Calm sky" className="w-full h-full object-cover opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF7]"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto mt-[-5vh]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="mb-8 text-[#FDFBF7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                >
                  <p className="text-lg md:text-xl font-sinhala-serif mb-8 tracking-wide leading-[2.5]">
                    සැනසෙන්න<br />
                    විදගන්න<br />
                    වැලදගන්න
                  </p>
                  <p className="text-lg md:text-xl font-sinhala-serif tracking-wide">
                    ඉතින්,
                  </p>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                  className="font-sinhala-serif text-5xl md:text-7xl font-bold text-[#FDFBF7] mb-6 tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                >
                  {SONG_NAME}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.5 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-xl md:text-2xl font-sinhala-serif text-[#FDFBF7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-wide mb-16">
                    ආදරේට ආදරේ දෙන්න.
                  </p>

                  <a
                    href="https://youtu.be/3U_vLSOcWVs?si=vbE39xoqgPKwBiXB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-4 transition-all hover:scale-105"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] flex items-center justify-center text-[#8C7C6B] shadow-sm group-hover:bg-[#F4EFE6] transition-colors">
                      <Headphones size={24} className="group-hover:text-[#4A443D] transition-colors" />
                    </div>
                    <span className="font-sinhala-serif text-lg tracking-wide text-[#4A443D]">අහන්න</span>
                  </a>


                </motion.div>
              </div>
            </section>




            {/* LISTENER MESSAGE COLLECTION (FORM) */}
            <section className="py-32 px-6 relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src="/bbb.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-transparent to-[#FDFBF7]"></div>
              </div>
              <div className="max-w-xl mx-auto relative z-10 w-full">
                <div className="text-center mb-16">
                  <h2 className="font-sinhala-serif text-3xl md:text-4xl text-[#4A443D]">
                    මේ සිංදුවට ඔයාගෙ අදහසත් මට අකුරු කරන්න 📝💕
                  </h2>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-8 md:p-14 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(140,124,107,0.3)] border border-white/60 relative">
                  {/* Decorative corner elements */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#8C7C6B]/30 rounded-tl-xl pointer-events-none"></div>
                  <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#8C7C6B]/30 rounded-tr-xl pointer-events-none"></div>
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#8C7C6B]/30 rounded-bl-xl pointer-events-none"></div>
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#8C7C6B]/30 rounded-br-xl pointer-events-none"></div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 text-[#8C7C6B] font-sinhala-serif"
                    >
                      <div className="w-20 h-20 bg-white/80 border border-[#E8E2D8] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Send className="text-[#8C7C6B] w-8 h-8 ml-[-2px]" />
                      </div>
                      <h4 className="text-3xl mb-3 text-[#4A443D]">බොහොම ස්තූතියි! ❤️</h4>
                    </motion.div>
                  ) : (
                    <form onSubmit={submitMessage} className="space-y-8 font-sinhala-sans relative z-10">
                      <div>
                        <label className="text-[10px] md:text-xs tracking-[0.2em] text-[#8C7C6B] mb-3 block uppercase font-serif">ඔයාගේ නම</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#FDFBF7]/60 border border-[#E8E2D8] rounded-xl px-5 py-4 text-[#4A443D] focus:outline-none focus:border-[#8C7C6B] focus:bg-white focus:shadow-[0_0_15px_rgba(140,124,107,0.1)] transition-all duration-500 placeholder:text-[#9A958F]/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] md:text-xs tracking-[0.2em] text-[#8C7C6B] mb-3 block uppercase font-serif">පණිවිඩය</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-[#FDFBF7]/60 border border-[#E8E2D8] rounded-xl px-5 py-4 text-[#4A443D] focus:outline-none focus:border-[#8C7C6B] focus:bg-white focus:shadow-[0_0_15px_rgba(140,124,107,0.1)] transition-all duration-500 resize-none h-40 leading-relaxed placeholder:text-[#9A958F]/50"
                          required
                        ></textarea>
                      </div>

                      <div className="pt-8 flex justify-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="font-serif tracking-[0.15em] text-xs md:text-sm uppercase px-12 md:px-16 py-4 bg-[#4A443D] text-[#FDFBF7] rounded-full hover:bg-[#8C7C6B] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                          {isSubmitting ? 'යැවෙමින් පවතී...' : 'පණිවිඩය යවන්න ♡'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>


            {/* ONE WORD SECTION */}
            <section className="relative min-h-[80dvh] py-32 px-6 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src="/last1.jpg" alt="Background" className="w-full h-full object-cover opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-transparent to-[#FDFBF7]"></div>
              </div>

              <div className="max-w-3xl mx-auto text-center relative z-10 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                >
                  <div className="mb-20 space-y-12">
                    <p className="font-sinhala-serif text-3xl md:text-5xl text-[#FDFBF7] leading-[2.2] tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      වචනයක් කියන්නෙ කතාවක්.<br />
                      හැගීමක තියෙන්නෙ කලාවක්.
                    </p>

                    <div className="w-16 h-[1px] bg-white/40 mx-auto"></div>

                    <p className="text-[#FDFBF7]/90 font-light text-lg md:text-xl leading-[2] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      හැගීම් මුසු වෙච්ච ඔයාගෙ තනි වචනෙ<br />මමත් ආසයි දැනගන්න.
                    </p>

                    <p className="font-sinhala-serif text-xl text-[#FDFBF7] tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pt-4">
                      කැමතිනම් ලියන්න. ❤️
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {!wordSubmitted ? (
                      <motion.form
                        key="word-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={submitOneWord}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto w-full"
                      >
                        <input
                          type="text"
                          value={oneWord}
                          onChange={(e) => setOneWord(e.target.value)}
                          placeholder="වචනයක් ලියන්න..."
                          maxLength={15}
                          className="w-full sm:w-2/3 bg-white/10 backdrop-blur-md border border-white/40 focus:bg-white/20 focus:border-white rounded-2xl px-6 py-4 text-center text-xl md:text-2xl font-sinhala-serif text-[#FDFBF7] outline-none placeholder:text-[#FDFBF7]/60 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full sm:w-1/3 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl text-[#FDFBF7] transition-all font-sinhala-serif tracking-widest text-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl hover:-translate-y-1"
                        >
                          යවන්න
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="word-success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-2xl font-sinhala-serif text-[#FDFBF7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      >
                        ස්තූතියි!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-20 relative h-[150px]">
                    {words.map((word, i) => (
                      <motion.div
                        key={`${word}-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="floating-word absolute font-sinhala-serif text-[#FDFBF7]/60 text-2xl md:text-4xl font-light whitespace-nowrap drop-shadow-md"
                        style={{
                          left: `${15 + (i * 20)}%`,
                          top: `${20 + (i % 3) * 30}%`,
                          animationDelay: `${i * -1.5}s`,
                          fontSize: `${1.5 + (Math.random() * 1)}rem`
                        }}
                      >
                        {word}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ARTIST GALLERY SECTION */}
            <section className="py-32 px-6 bg-[#FDFBF7]">
              <div className="max-w-6xl mx-auto text-center space-y-16">

                {/* Auto-scrolling Artists Gallery */}
                <div className="relative w-full overflow-hidden flex pb-12 pt-4">
                  {/* Fade masks for edges */}
                  <div className="absolute top-0 bottom-0 left-0 w-8 md:w-32 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute top-0 bottom-0 right-0 w-8 md:w-32 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>

                  <motion.div
                    className="flex gap-6 md:gap-10 min-w-max px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 35, repeat: Infinity }}
                  >
                    {[
                      { name: "Malshan Ranawella", role: "Artist & Melody", image: "/malshan.jpg" },
                      { name: "Yashodha Adhikari", role: "Lyrics", image: "/yashoda.jpg" },
                      { name: "Lahiru De Costa", role: "Produced, Mixed & Mastered", image: "/lahiru.jpg" },
                      { name: "Dihan Kularatne", role: "Guitars", image: "/dihan.jpg" },
                      { name: "Supun Peiris", role: "Flutes", image: "/supun.jpg" },
                      { name: "Malshan Ranawella", role: "Artist & Melody", image: "/malshan.jpg" },
                      { name: "Yashodha Adhikari", role: "Lyrics", image: "/yashoda.jpg" },
                      { name: "Lahiru De Costa", role: "Produced, Mixed & Mastered", image: "/lahiru.jpg" },
                      { name: "Dihan Kularatne", role: "Guitars", image: "/dihan.jpg" },
                      { name: "Supun Peiris", role: "Flutes", image: "/supun.jpg" },
                    ].map((artist, idx) => (
                      <div key={idx} className="flex-shrink-0 flex flex-col items-center space-y-4 w-[240px] md:w-[280px]">
                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_15px_30px_-10px_rgba(140,124,107,0.2)]">
                          <img src={artist.image} alt={artist.name} className={`w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ${artist.name === 'Supun Peiris' ? 'object-top' : ''}`} />
                        </div>
                        <div className="text-center">
                          <p className="text-[#9A958F] text-[10px] md:text-xs uppercase tracking-widest mb-1 font-sans font-light">{artist.role}</p>
                          <p className="text-[#4A443D] text-lg md:text-xl font-sinhala-serif">{artist.name}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </section>

            {/* FINAL SECTION */}
            <footer className="py-32 px-6 flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-t from-[#F4EFE6] to-[#FDFBF7]">
              <div className="absolute inset-0 z-0 opacity-10">
                <img src={HERO_BG} alt="Calm backdrop" className="w-full h-full object-cover blur-md" />
              </div>

              <div className="max-w-2xl mx-auto space-y-12 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <h2 className="font-sinhala-serif text-3xl md:text-4xl text-[#4A443D] mb-3 flex items-center justify-center gap-2">
                    ස්තූතියි. <span className="text-2xl md:text-3xl">❤️</span>
                  </h2>
                  <p className="font-sinhala-serif text-xl md:text-2xl text-[#8C7C6B] font-light tracking-wider opacity-90 mb-8">
                    මම, මල්ෂාන් රන්වැල්ල
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8"
                >
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      if (!isPlaying) togglePlay();
                    }}
                    className="flex items-center gap-2 px-8 py-3 text-[#8C7C6B] hover:text-[#4A443D] border border-transparent hover:border-[#D2D6C9] rounded-full transition-all text-sm"
                  >
                    <Headphones size={16} /> ආයෙත් අහන්න
                  </button>

                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 2 }}
                  className="pt-16 pb-8 flex flex-col items-center gap-4"
                >

                  <p className="text-[#9A958F] text-[10px] font-sans tracking-widest uppercase">
                    Create yours with <a target="_blank" rel="noreferrer" className="text-[#8C7C6B] hover:text-[#4A443D] underline" href="https://wa.me/94707819074">invitemint</a>
                  </p>
                </motion.div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
