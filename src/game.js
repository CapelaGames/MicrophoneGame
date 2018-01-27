class Game {
  constructor(library) {
    this.library = library;
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
    if (this.waitingForAnswer) {
      this.answeredCharacter();
      return;
    }
    this.currentMessage = this.library.getRoot();
    this.playMessage();
    phone.classList.add('call-active');
    this.runCallTimer();
    log('Starting game')
  }

  pauseGame() {
    this.paused = true;
    this.recognition.stop();
    this.timeoutFn = null;
    this.currentPlayID = Math.random();
    this.currentMessage.audio().pause();
    document.body.classList.remove('phone-only');
    phone.classList.remove('call-active');
    callInfo.textContent = '';
  }

  runCallTimer() {
    var callInfo = document.getElementById('call-info');
    callInfo.textContent = '00:00';
    var time = 0;
    var updateTime = () => {
      time += 1;
      let seconds = time % 60 < 10 ? `0${time % 60}` : `${time % 60}`;
      let minutes = Math.floor(time / 60 < 10) ? `0${Math.floor(time / 60)}` : `${Math.floor(time / 60)}`; // I was lazy I'm sorry
      callInfo.textContent = `${minutes}:${seconds}`;
      if (!this.paused) {
        setTimeout(updateTime, 1000);
      }
    };
    setTimeout(updateTime, 1000);
  }

  playMessage() {
    if (this.waitingForAnswer) {
      return;
    }

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
    this.currentMessage = this.library.get(identifier);
    if (this.currentMessage.hasCommand()) {
      this.processCommands(this.currentMessage.getCommand());
    }
    this.playMessage();

    log('Playing', identifier);
  }

  processCommands(commands) {
    for (let command of commands.split(',')) {
      this.processCommand(command);
    }
  }

  processCommand(command) {
    let args = command.split(':');
    if (args[0] in this) {
      this[args[0]].apply(this, args.slice(1))
    }
  }

  startCharacter(identifier) {
    // first we have to hang up the old character

    // TODO: Play hangup sound

    phone.classList.remove('call-active');
    phone.classList.add('call-ended');

    setTimeout(() => {
      let character = this.library.get(identifier);
      character.updatePhone();

      // TODO: Play dial sound

      this.waitingForAnswer = true;
    }, 1000); // is this long enough? too long?

    log('Character calling', identifier);
  }

  answeredCharacter() {
    this.waitingForAnswer = false;
    phone.classList.add('call-active');
    this.runCallTimer();

    log('Answered character');
  }

  shouldBlockRecognition() {
    return this.paused || this.playingAudio || this.waitingForAnswer;
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
    if (this.shouldBlockRecognition()) {
      return;
    }
    this.recognition.start();
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

    if (this.shouldBlockRecognition()) {
      return;
    }
    this.nextMessage('__default');
  }

  recognitionError(event) {
    log('Recognition error', event.error);

    if (this.shouldBlockRecognition()) {
      return;
    }
    this.nextMessage('__default');
  }

  recognitionResult(event) {
    if (this.shouldBlockRecognition()) {
      return;
    }

    let last = event.results.length - 1;
    let transcript = event.results[last][0].transcript;

    log('Result:', transcript);

    this.nextMessage(transcript);
    this.recognition.stop();
  }
}
