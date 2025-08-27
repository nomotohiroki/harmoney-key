class HarmonyKeyApp {
    constructor() {
        this.audioEngine = new AudioEngine();
        this.chordManager = new ChordManager();
        this.activeKeys = new Set();
        this.init();
    }

    async init() {
        await this.audioEngine.init();
        this.setupKeyboardListeners();
        this.setupChordTypeButtons();
        this.createVisualKeyboard();
        this.updateDisplay();
    }

    setupKeyboardListeners() {
        const keyMapping = this.chordManager.getKeyboardMapping();
        
        document.addEventListener('keydown', async (e) => {
            const key = e.key.toLowerCase();
            
            if (this.activeKeys.has(key)) return;
            
            if (keyMapping[key]) {
                e.preventDefault();
                this.activeKeys.add(key);
                
                if (!this.audioEngine.isInitialized) {
                    await this.audioEngine.init();
                }
                
                const keyInfo = keyMapping[key];
                this.chordManager.setRoot(keyInfo.note);
                const frequencies = this.chordManager.getChordFrequencies(keyInfo.note, this.chordManager.currentType, keyInfo.octave);
                this.audioEngine.playChord(frequencies);
                this.updateDisplay();
                this.highlightKey(key, true);
            }
            
            if (key >= '0' && key <= '6') {
                e.preventDefault();
                const types = ['single', 'major', 'minor', 'seventh', 'maj7', 'dim', 'aug'];
                const typeIndex = parseInt(key);
                this.chordManager.setType(types[typeIndex]);
                this.updateChordTypeButtons(types[typeIndex]);
                this.updateDisplay();
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.activeKeys.delete(key);
            this.highlightKey(key, false);
        });
    }

    setupChordTypeButtons() {
        const buttons = document.querySelectorAll('.chord-type');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                this.chordManager.setType(type);
                this.updateChordTypeButtons(type);
                this.updateDisplay();
            });
        });
    }

    updateChordTypeButtons(activeType) {
        const buttons = document.querySelectorAll('.chord-type');
        buttons.forEach(button => {
            if (button.dataset.type === activeType) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    createVisualKeyboard() {
        const container = document.getElementById('visual-keyboard');
        container.innerHTML = '';
        
        const pianoWrapper = document.createElement('div');
        pianoWrapper.className = 'piano-wrapper';
        
        const keyMapping = this.chordManager.getKeyboardMapping();
        
        const whiteKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ":", ']'];
        const blackKeys = ['w', 'e', 't', 'y', 'u', 'o', 'p', '['];
        
        // Create white keys container
        const whiteKeysContainer = document.createElement('div');
        whiteKeysContainer.className = 'white-keys-container';
        
        // Create keys with proper positioning
        whiteKeys.forEach((key, index) => {
            const keyInfo = keyMapping[key];
            if (keyInfo) {
                const keyWrapper = document.createElement('div');
                keyWrapper.className = 'key-wrapper';
                
                const whiteKey = this.createKeyButton(key, keyInfo, false);
                keyWrapper.appendChild(whiteKey);
                
                // Add black key after certain white keys
                const blackKeyMap = {
                    0: 'w',  // After C (a)
                    1: 'e',  // After D (s)
                    3: 't',  // After F (f)
                    4: 'y',  // After G (g)
                    5: 'u',  // After A (h)
                    7: 'o',  // After C octave (k)
                    8: 'p',  // After D octave (l)
                    10: '['  // After F octave (')
                };
                
                if (blackKeyMap[index]) {
                    const blackKeyLetter = blackKeyMap[index];
                    const blackKeyInfo = keyMapping[blackKeyLetter];
                    if (blackKeyInfo) {
                        const blackKey = this.createKeyButton(blackKeyLetter, blackKeyInfo, true);
                        blackKey.className += ' positioned-black-key';
                        keyWrapper.appendChild(blackKey);
                    }
                }
                
                whiteKeysContainer.appendChild(keyWrapper);
            }
        });
        
        pianoWrapper.appendChild(whiteKeysContainer);
        container.appendChild(pianoWrapper);
    }
    
    createKeyButton(key, keyInfo, isBlackKey) {
        const keyButton = document.createElement('div');
        keyButton.className = isBlackKey ? 'key-button black-key' : 'key-button white-key';
        keyButton.dataset.key = key;
        
        const keyLetter = document.createElement('div');
        keyLetter.className = 'key-letter';
        keyLetter.textContent = key === ';' ? ';' : key === "'" ? "'" : key.toUpperCase();
        
        const keyNote = document.createElement('div');
        keyNote.className = 'key-note';
        keyNote.textContent = keyInfo.note;
        
        keyButton.appendChild(keyLetter);
        keyButton.appendChild(keyNote);
        
        keyButton.addEventListener('mousedown', async () => {
            if (!this.audioEngine.isInitialized) {
                await this.audioEngine.init();
            }
            this.chordManager.setRoot(keyInfo.note);
            const frequencies = this.chordManager.getChordFrequencies(keyInfo.note, this.chordManager.currentType, keyInfo.octave);
            this.audioEngine.playChord(frequencies);
            this.updateDisplay();
            keyButton.classList.add('active');
        });
        
        keyButton.addEventListener('mouseup', () => {
            keyButton.classList.remove('active');
        });
        
        keyButton.addEventListener('mouseleave', () => {
            keyButton.classList.remove('active');
        });
        
        return keyButton;
    }

    highlightKey(key, isActive) {
        const keyButton = document.querySelector(`[data-key="${key}"]`);
        if (keyButton) {
            if (isActive) {
                keyButton.classList.add('active');
            } else {
                keyButton.classList.remove('active');
            }
        }
    }

    updateDisplay() {
        const chordName = this.chordManager.getChordName();
        const chordNotes = this.chordManager.getChordNotes();
        
        document.getElementById('current-chord').textContent = chordName;
        document.getElementById('chord-notes').textContent = chordNotes.join(' - ');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HarmonyKeyApp();
});