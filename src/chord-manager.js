class ChordManager {
    constructor() {
        this.currentRoot = 'C';
        this.currentType = 'major';
        this.chordIntervals = {
            'single': [0],
            'major': [0, 4, 7],
            'minor': [0, 3, 7],
            'seventh': [0, 4, 7, 10],
            'maj7': [0, 4, 7, 11],
            'dim': [0, 3, 6],
            'aug': [0, 4, 8]
        };
        
        this.noteSequence = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }

    setRoot(note) {
        this.currentRoot = note;
    }

    setType(type) {
        if (this.chordIntervals[type]) {
            this.currentType = type;
        }
    }

    getChordNotes(root = this.currentRoot, type = this.currentType) {
        const rootIndex = this.noteSequence.indexOf(root);
        if (rootIndex === -1) return [];
        
        const intervals = this.chordIntervals[type];
        const notes = intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return this.noteSequence[noteIndex];
        });
        
        return notes;
    }

    getChordFrequencies(root = this.currentRoot, type = this.currentType, octave = 4) {
        const actualType = type || this.currentType;
        const notes = this.getChordNotes(root, actualType);
        return notes.map((note, index) => {
            const noteOctave = octave + Math.floor((this.noteSequence.indexOf(root) + this.chordIntervals[actualType][index]) / 12);
            return this.noteToFrequency(note, noteOctave);
        });
    }

    noteToFrequency(note, octave = 4) {
        const A4 = 440;
        const noteIndex = this.noteSequence.indexOf(note);
        const A4Index = this.noteSequence.indexOf('A');
        
        const halfSteps = noteIndex - A4Index + (octave - 4) * 12;
        return A4 * Math.pow(2, halfSteps / 12);
    }

    getChordName(root = this.currentRoot, type = this.currentType) {
        const typeNames = {
            'single': '',
            'major': 'Major',
            'minor': 'Minor',
            'seventh': '7',
            'maj7': 'Maj7',
            'dim': 'Dim',
            'aug': 'Aug'
        };
        return type === 'single' ? root : `${root} ${typeNames[type]}`;
    }

    getKeyboardMapping() {
        return {
            'a': { note: 'C', octave: 4 },
            'w': { note: 'C#', octave: 4 },
            's': { note: 'D', octave: 4 },
            'e': { note: 'D#', octave: 4 },
            'd': { note: 'E', octave: 4 },
            'f': { note: 'F', octave: 4 },
            't': { note: 'F#', octave: 4 },
            'g': { note: 'G', octave: 4 },
            'y': { note: 'G#', octave: 4 },
            'h': { note: 'A', octave: 4 },
            'u': { note: 'A#', octave: 4 },
            'j': { note: 'B', octave: 4 },
            'k': { note: 'C', octave: 5 },
            'o': { note: 'C#', octave: 5 },
            'l': { note: 'D', octave: 5 },
            'p': { note: 'D#', octave: 5 },
            ';': { note: 'E', octave: 5 },
            ':': { note: 'F', octave: 5 },
            '[': { note: 'F#', octave: 5 },
            ']': { note: 'G', octave: 5 }
        };
    }
}