# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Harmony Key is a browser-based web application that plays harmonies when keyboard keys are pressed. Each key press triggers a complete chord (not single notes), with support for different chord types that can be switched using number keys.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 8080)
npm start
# or
npm run dev

# Access the application
# Open http://localhost:8080 in browser
```

## Architecture

### Core Components

- **AudioEngine** (`src/audio-engine.js`): Handles Web Audio API synthesis
  - Creates oscillators for chord playback
  - Manages audio context and gain control
  - Converts note names to frequencies

- **ChordManager** (`src/chord-manager.js`): Musical logic and chord theory
  - Defines chord intervals for major, minor, 7th, maj7, dim, aug
  - Maps keyboard keys to musical notes
  - Calculates chord frequencies based on root note and type

- **HarmonyKeyApp** (`src/app.js`): Main application controller
  - Handles keyboard and mouse events
  - Coordinates between AudioEngine and ChordManager
  - Updates UI display and visual feedback

## Key Mappings

- **A-L keys**: Play chords with different root notes
  - A=C, S=D, D=E, F=F, G=G, H=A, J=B, K=C(octave up)
- **Number keys 1-6**: Switch chord types
  - 1=Major, 2=Minor, 3=7th, 4=Maj7, 5=Dim, 6=Aug

## Technical Notes

- Uses Web Audio API for real-time audio synthesis
- No external audio files required - all sounds are generated
- Responsive visual keyboard with mouse support
- Chord display shows current chord name and component notes