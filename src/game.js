class Game {
  constructor(library) {
    this.library = library;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'en-AU';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.waitForLoad();

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

  waitForLoad() {
    this.loading = true;
    phone.classList.add('loading');
    log('Loading...');

    for (let audio of document.querySelectorAll('audio')) {
      if (audio.duration == 0) {
        setTimeout(this.waitForLoad.bind(this), 300);
        return;
      }
    }

    this.loading = false;
    phone.classList.remove('loading');
    log('Loaded!');

    setTimeout(() => {
      if (this.gameStarted) {
        return; // the game has already started don't ring
      }

      this.loopRinging();
    }, 3000);
  }

  startGame() {
    if (this.waitingForAnswer) {
      this.answeredCharacter();
      return;
    }
    this.gameStarted = true;
    this.currentMessage = this.library.getRoot();
    this.playMessage();
    phone.classList.add('call-active');
    this.runCallTimer();
    log('Starting game')

    // TODO: Don't start game until we have microphone permissions
  }

  pauseGame() {
    // this method lies, it actually resets the whole game so yeah

    this.paused = true;
    this.recognition.stop();
    this.currentPlayID = Math.random();
    this.currentMessage.audio().pause();
    this.gameStarted = false;
    document.body.classList.remove('phone-only');
    phone.classList.remove('call-active');
    document.getElementById('call-info').textContent = '';

    for (let audio of document.querySelectorAll('audio')) {
      audio.fastSeek(0);
    }

    log('Game reset');
  }

  runCallTimer() {
    var callInfo = document.getElementById('call-info');
    callInfo.textContent = '00:00';
    var time = 0;
    var updateTime = () => {
      if (this.paused) {
        return;
      }

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

    let playID = Math.random();
    this.currentPlayID = playID;
    let timeoutFn = () => {
      // Check if we've moved on and we still want to timeout
      if (playID === this.currentPlayID) {
        log('Response timed out');
        this.nextMessage('__default');
        this.recognition.stop();
      }
    }

    // When the audio finishes playing
    audio.onended = (event) => {
      this.playingAudio = false;
      this.recognition.start();
      audio.onended = () => {};

      setTimeout(timeoutFn, 4000); // Timeout
    };
    audio.play();
  }

  nextMessage(transcript) {
    let identifier = this.currentMessage.nextMessage(transcript);
    if (identifier == '__finish') {
      log('Game Over');
      this.pauseGame();
      return;
    }
    this.currentMessage = this.library.get(identifier);
    if (!this.currentMessage) {
      log('Error, missing message:', identifier);
      return;
    }
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
      let fn = this[args[0]];
      if (fn) {
        fn.apply(this, args.slice(1))
        log('Running command:', command)
      } else {
        log('Error command missing:', command)
      }
    }
  }

  startCharacter(identifier) {
    phone.classList.remove('call-active');
    phone.classList.add('call-ended');

    setTimeout(() => {
      let character = this.library.get(identifier);
      character.updatePhone();

      this.loopRinging();

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

  loopRinging() {
    // TODO: play dial sound
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
