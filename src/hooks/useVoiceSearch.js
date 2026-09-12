import { useState, useRef, useCallback } from 'react';

/**
 * useVoiceSearch – A reusable React hook for voice-to-text search.
 *
 * Uses the browser's built-in Web Speech API (SpeechRecognition /
 * webkitSpeechRecognition) so no paid API or third-party library is needed.
 *
 * Usage:
 *   const { isListening, isProcessing, error, startListening } = useVoiceSearch({
 *     onResult: (text) => setSearchQuery(text),
 *     onError:  (msg)  => console.error(msg),
 *   });
 *
 * @param {Object}   opts
 * @param {Function} opts.onResult  – called with the recognised text string
 * @param {Function} [opts.onError] – called with an error message string
 * @returns {{ isListening: boolean, isProcessing: boolean, error: string|null, startListening: () => void, stopListening: () => void }}
 */
export function useVoiceSearch({ onResult, onError } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // ---------- helpers ----------

  /** Check whether the browser supports the Web Speech API */
  const getSpeechRecognition = () => {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  };

  /** Fire the optional onError callback and store the error in state */
  const handleError = useCallback(
    (message) => {
      setError(message);
      onError?.(message);
    },
    [onError],
  );

  // ---------- public API ----------

  /**
   * Start listening for speech.
   * – Requests microphone permission automatically.
   * – Stops any already-running recognition session first.
   */
  const startListening = useCallback(() => {
    // 1. Feature detection
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      handleError('Your browser does not support voice search. Try Chrome or Edge.');
      return;
    }

    // 2. Stop previous session if still running
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    // 3. Create a new recognition instance
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';          // language
    recognition.interimResults = false;   // we only want the final result
    recognition.maxAlternatives = 1;      // single best result
    recognition.continuous = false;       // stop after one phrase

    // -- Event: recognition started (microphone active) --
    recognition.onstart = () => {
      setIsListening(true);
      setIsProcessing(false);
      setError(null);
    };

    // -- Event: the user stopped speaking, now processing --
    recognition.onspeechend = () => {
      setIsListening(false);
      setIsProcessing(true);
    };

    // -- Event: final transcription ready --
    recognition.onresult = (event) => {
      setIsProcessing(false);
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onResult?.(transcript);
      }
    };

    // -- Event: an error occurred --
    recognition.onerror = (event) => {
      setIsListening(false);
      setIsProcessing(false);

      switch (event.error) {
        case 'not-allowed':
          handleError('Microphone permission denied. Please allow mic access in your browser settings.');
          break;
        case 'no-speech':
          handleError('No speech detected. Please try again.');
          break;
        case 'network':
          handleError('Network error. Check your internet connection.');
          break;
        case 'aborted':
          // User or code aborted – nothing to show
          break;
        default:
          handleError(`Speech recognition error: ${event.error}`);
      }
    };

    // -- Event: recognition session ended --
    recognition.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
      recognitionRef.current = null;
    };

    // 4. Start recognising
    recognitionRef.current = recognition;
    recognition.start();
  }, [handleError, onResult]);

  /**
   * Manually stop / cancel recognition.
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setIsProcessing(false);
  }, []);

  return { isListening, isProcessing, error, startListening, stopListening };
}
