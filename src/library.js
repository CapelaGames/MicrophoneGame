class MessageLibrary {
  constructor() {
    this.messages = {};
  }

  add(identifier, message) {
    this.messages[identifier] = message;
  }

  getMessage(identifier) {
    return this.messages[identifier];
  }

  setRoot(identifier) {
    this.root = identifier;
  }

  getRoot() {
    return this.getMessage(this.root);
  }
}
