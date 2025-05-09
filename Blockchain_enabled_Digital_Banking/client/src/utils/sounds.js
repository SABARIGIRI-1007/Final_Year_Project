// Base64 encoded short audio files for minimal loading time
const SOUND_EFFECTS = {
  SUCCESS: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAoYuxWqTAAAA//tQxAAAAAAJEAAAAgAAA0gAAABExUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxBmAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
  ERROR: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAoZBCCp3AAAA//tQxAAAAABpAAAACAAADSAAAAEERUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxBmAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
  PENDING: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAoZo/WBXAAAA//tQxAAAAAAJEAAAAgAAA0gAAABEQUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxBmAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
};

class SoundEffects {
  static #instance = null;
  #audioContext = null;
  #volume = 0.5;
  #enabled = true;

  constructor() {
    if (SoundEffects.#instance) {
      return SoundEffects.#instance;
    }
    this.#initAudioContext();
    SoundEffects.#instance = this;
  }

  #initAudioContext() {
    try {
      this.#audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API is not supported in this browser');
    }
  }

  setVolume(volume) {
    this.#volume = Math.max(0, Math.min(1, volume));
  }

  enable() {
    this.#enabled = true;
  }

  disable() {
    this.#enabled = false;
  }

  async playSound(type) {
    if (!this.#enabled || !this.#audioContext) return;

    try {
      const response = await fetch(SOUND_EFFECTS[type]);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.#audioContext.decodeAudioData(arrayBuffer);
      
      const source = this.#audioContext.createBufferSource();
      const gainNode = this.#audioContext.createGain();
      
      source.buffer = audioBuffer;
      gainNode.gain.value = this.#volume;
      
      source.connect(gainNode);
      gainNode.connect(this.#audioContext.destination);
      
      source.start(0);
    } catch (error) {
      console.warn('Error playing sound effect:', error);
    }
  }
}

export const soundEffects = new SoundEffects(); 
