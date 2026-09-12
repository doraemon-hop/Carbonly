import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

/**
 * VoiceSearchButton – A reusable microphone button for voice search.
 *
 * Drop this component next to any search <input> and pass `onResult`
 * to receive the transcribed text.
 *
 * Props:
 *  - onResult(text)  : called with the recognised speech text
 *  - onError(msg)    : optional – called with error messages
 *  - className       : optional – extra Tailwind classes for positioning
 *
 * UI states:
 *  🎤  Idle (grey mic icon)
 *  🔴  Listening (pulsing red ring + green mic)
 *  ⏳  Processing (spinning loader)
 *  ❌  Error (shows tooltip briefly)
 */
export const VoiceSearchButton = ({ onResult, onError, className = '' }) => {
  const { isListening, isProcessing, error, startListening, stopListening } =
    useVoiceSearch({ onResult, onError });

  // Toggle: click once to start, click again to stop
  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
        title={
          isProcessing
            ? 'Processing speech…'
            : isListening
              ? 'Listening… click to stop'
              : error
                ? error
                : 'Click to search by voice'
        }
        className={`
          p-1.5 rounded-full transition-all duration-200 focus:outline-none
          ${isListening
            ? 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-400 animate-pulse'
            : isProcessing
              ? 'bg-slate-100 text-slate-400 cursor-wait'
              : error
                ? 'bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
          }
        `}
      >
        {/* Icon: Loader while processing, MicOff on error, Mic otherwise */}
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : error ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Floating status label (appears while listening) */}
      {isListening && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-lg animate-bounce">
          Listening…
        </span>
      )}

      {/* Floating status label (appears while processing) */}
      {isProcessing && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-lg bg-slate-700 text-white text-[10px] font-bold shadow-lg">
          Processing…
        </span>
      )}
    </div>
  );
};
