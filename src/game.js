class Game {
  constructor(messageLibrary) {
    this.messageLibrary = messageLibrary;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'en-AU';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    start.addEventListener('click', this.startPressed.bind(this));
    pause.addEventListener('click', this.pausePressed.bind(this));

    this.recognition.addEventListener('start', this.recognitionStart.bind(this));
    this.recognition.addEventListener('end', this.recognitionEnd.bind(this));
    this.recognition.addEventListener('soundstart', this.recognitionSoundStart.bind(this));
    this.recognition.addEventListener('soundend', this.recognitionSoundEnd.bind(this));
    this.recognition.addEventListener('speechstart', this.recognitionSpeechStart.bind(this));
    this.recognition.addEventListener('speechend', this.recognitionSpeechEnd.bind(this));
    this.recognition.addEventListener('nomatch', this.recognitionNoMatch.bind(this));
    this.recognition.addEventListener('error', this.recognitionError.bind(this));
    this.recognition.addEventListener('result', this.recognitionResult.bind(this));
  }

  startGame() {
    this.currentMessage = this.messageLibrary.getRoot();
    this.playMessage();
    log('Starting game')
  }

  pauseGame() {
    this.paused = true;
    this.recognition.stop();
    this.timeoutFn = null;
    this.currentMessage.audio().pause();
  }

  playMessage() {
    let audio = this.currentMessage.audio();
    if (audio.duration == 0) { // not loaded
      setTimeout(this.playMessage.bind(this), 100);
      return;
    }

    this.playingAudio = true;
    // When the audio finishes playing
    setTimeout(() => {
      this.playingAudio = false;
      this.recognition.start();
    }, (1000 * audio.duration) - 500);

    audio.play();
    this.timeoutFn = () => {
      log('Response timed out');
      this.nextMessage('__default');
    };

    let playID = Math.random();
    this.currentPlayID = playID;
    setTimeout(() => {
      // Check if we've moved on and we still want to timeout
      if (playID === this.currentPlayID && this.timeoutFn) {
        this.timeoutFn();
      }
    }, 4000 + (1000 * audio.duration)); // Timeout
  }

  nextMessage(transcript) {
    let identifier = this.currentMessage.nextMessage(transcript);
    if (identifier == '__finish') {
      log('Game Over');
      this.pauseGame();
      return;
    }
    this.currentMessage = this.messageLibrary.getMessage(identifier);
    this.playMessage();

    log('Playing', identifier);
  }


  //
  // Event Handlers
  //

  startPressed() {
    this.startGame();
  }

  pausePressed() {
    this.pauseGame();
  }

  // Recognition Events
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition

  recognitionStart(event) {
    log('Recognition Started');
  }

  recognitionEnd(event) {
    log('Recognition Ended');
    if (!this.paused && !this.playingAudio) {
      this.recognition.start();
    }
  }

  recognitionSoundStart(event) {
    log('Sound Started');
  }

  recognitionSoundEnd(event) {
    log('Sound Ended');
  }

  recognitionSpeechStart(event) {
    log('Speech Started');
    this.timeoutFn = null;
  }

  recognitionSpeechEnd(event) {
    log('Speech Ended');
  }

  recognitionNoMatch(event) {
    log('No match');

    if (this.playingAudio) {
      return;
    }
    this.nextMessage('__default');
  }

  recognitionError(event) {
    log('Recognition error', event.error);

    if (this.playingAudio) {
      return;
    }
    this.nextMessage('__default');
  }

  recognitionResult(event) {
    if (this.playingAudio) {
      return;
    }

    let last = event.results.length - 1;
    let transcript = event.results[last][0].transcript;

    log('Result:', transcript);

    this.nextMessage(transcript);
    this.recognition.stop();
  }
}