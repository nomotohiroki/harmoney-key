class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.audioContext.destination);
        
        this.isInitialized = true;
    }

    playChord(frequencies, duration = 1.0) {
        if (!this.isInitialized) {
            this.init();
        }

        const now = this.audioContext.currentTime;
        const oscillators = [];
        const gains = [];

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
            
            oscillators.push(oscillator);
            gains.push(gain);
        });

        return { oscillators, gains };
    }

    noteToFrequency(note) {
        const notes = {
            'C': 261.63,
            'C#': 277.18,
            'Db': 277.18,
            'D': 293.66,
            'D#': 311.13,
            'Eb': 311.13,
            'E': 329.63,
            'F': 349.23,
            'F#': 369.99,
            'Gb': 369.99,
            'G': 392.00,
            'G#': 415.30,
            'Ab': 415.30,
            'A': 440.00,
            'A#': 466.16,
            'Bb': 466.16,
            'B': 493.88
        };
        
        const baseNote = note.replace(/\d+/, '');
        const octave = parseInt(note.match(/\d+/) || '4');
        const baseFreq = notes[baseNote];
        
        if (!baseFreq) return 440;
        
        const octaveShift = octave - 4;
        return baseFreq * Math.pow(2, octaveShift);
    }
}