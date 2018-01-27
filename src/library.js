class Library {
  constructor() {
    this.messages = {};
  }

  add(identifier, message) {
    this.messages[identifier] = message;
  }

  get(identifier) {
    return this.messages[identifier];
  }

  setRoot(identifier) {
    this.root = identifier;
  }

  getRoot() {
    return this.get(this.root);
  }
}
