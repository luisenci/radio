import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Image as ImageIcon, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { soundEngine } from "../lib/sounds";

interface TransitionViewProps {
  imageUrl: string | null;
}

export default function TransitionView({ imageUrl }: TransitionViewProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [duration, setDuration] = useState(5.0);
  const [blurAmount, setBlurAmount] = useState(60);
  const [easing, setEasing] = useState("easeInOut");
  const [delay, setDelay] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    soundEngine.setVolume(soundEnabled ? volume : 0);
  }, [volume, soundEnabled]);

  const easingOptions = [
    { value: "linear", label: "Linear" },
    { value: "easeIn", label: "Ease In" },
    { value: "easeOut", label: "Ease Out" },
    { value: "easeInOut", label: "Ease In Out" },
    { value: "anticipate", label: "Anticipate" },
    { value: "backIn", label: "Back In" },
    { value: "backOut", label: "Back Out" },
    { value: "backInOut", label: "Back In Out" },
    { value: "circIn", label: "Circ In" },
    { value: "circOut", label: "Circ Out" },
    { value: "circInOut", label: "Circ In Out" },
  ];

  const toggleTransition = () => {
    const nextState = !isTransitioning;
    setIsTransitioning(nextState);
    
    if (nextState && soundEnabled) {
      setTimeout(() => {
        soundEngine.playWhoosh(duration);
      }, delay * 1000);
    }
  };

  const reset = () => {
    setIsTransitioning(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto p-6">
      <div className="relative w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
        {!imageUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-4">
            <ImageIcon size={64} className="opacity-20" />
            <p className="font-sans text-sm uppercase tracking-widest opacity-50">No initial image selected</p>
          </div>
        ) : (
          <motion.div
            initial={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
            animate={{ 
              filter: isTransitioning ? `blur(${blurAmount}px)` : "blur(0px)",
              opacity: isTransitioning ? 0 : 1,
              scale: isTransitioning ? 1.1 : 1
            }}
            transition={{ 
              duration: duration,
              ease: easing,
              delay: isTransitioning ? delay : 0
            }}
            className="absolute inset-0"
          >
            <img 
              src={imageUrl} 
              alt="Transition preview" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        {/* Overlay status */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTransitioning ? 'bg-neutral-500' : 'bg-red-600 animate-pulse'}`} />
          <span className="font-mono text-[10px] uppercase tracking-tighter text-neutral-400">
            {isTransitioning ? 'Transition Active' : 'Live Preview'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full bg-neutral-900/50 p-8 rounded-3xl border border-neutral-800 backdrop-blur-sm">
        <div className="space-y-6">
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Transition duration ({duration}s)
            </label>
            <input 
              type="range" 
              min="0.1" 
              max="10.0" 
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>
          
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Blur intensity ({blurAmount}px)
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={blurAmount}
              onChange={(e) => setBlurAmount(parseInt(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Transition Delay ({delay}s)
            </label>
            <input 
              type="range" 
              min="0" 
              max="5" 
              step="0.1"
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-neutral-500 mb-4 flex items-center justify-between">
              <span>Sound Volume</span>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-neutral-400 hover:text-white transition-colors"
                title={soundEnabled ? "Mute" : "Unmute"}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
            </label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              disabled={!soundEnabled}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Animation Easing
            </label>
            <select
              value={easing}
              onChange={(e) => setEasing(e.target.value)}
              className="w-full bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer"
            >
              {easingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <button
            onClick={toggleTransition}
            disabled={!imageUrl}
            className={`flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-sans font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
              isTransitioning 
                ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20'
            }`}
          >
            <Play size={18} fill={isTransitioning ? "transparent" : "currentColor"} />
            {isTransitioning ? 'Show Original' : 'Trigger Transition'}
          </button>

          <button
            onClick={reset}
            disabled={!imageUrl}
            className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-neutral-800 text-neutral-400 font-sans font-medium hover:bg-neutral-700 transition-all disabled:opacity-30"
          >
            <RotateCcw size={18} />
            Reset Overlay
          </button>
        </div>
      </div>
    </div>
  );
}
