class MessageNode {
  constructor(audioId, response) {
    this.audioId = audioId;
    this.response = response;
  }

  audio() {
    return document.getElementById(this.audioId);
  }
  
  nextMessage(transcript) {
    return this.response.nextMessage(transcript);
  }
}

class ResponseOption {
  constructor(phrases) {
    this.phrases = phrases;
  }

  matches(transcript) {
    for (let phrase of this.phrases) {
      if (transcript.toLowerCase().includes(phrase.toLowerCase())) {
        return true;
      }
    }

    return false;
  }
}

class ResponseNode {
  constructor(mapping, defaultMessage) {
    this.mapping = mapping;
    this.defaultMessage = defaultMessage;
  }

  nextMessage(transcript) {
    for (let [option, message] of this.mapping) {
      if (option.matches(transcript)) {
        return message;
      }
    }

    return this.defaultMessage;
  }
}
