class CharacterNode {
  constructor(name, role, src) {
    this.name = name;
    this.role = role;
    this.src = src;
  }

  updatePhone() {
    document.getElementById('caller-name').textContent = this.name;
    document.getElementById('caller-role').textContent = this.role;
    document.getElementById('caller-image').src = this.src;
  }
}

class MessageNode {
  constructor(audioId, response, command) {
    this.audioId = audioId;
    this.response = response;
    this.command = command;
  }

  audio() {
    return document.getElementById(this.audioId);
  }

  nextMessage(transcript) {
    return this.response.nextMessage(transcript);
  }

  hasCommand() {
    return !!this.command;
  }

  getCommand() {
    return this.command;
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
