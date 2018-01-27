window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
window.SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

window.messageLibrary = new MessageLibrary();
window.game = new Game(messageLibrary);

function log() {
  let args = [];
  for (arg of arguments) {
    args.push(arg);
  }

  console.log.apply(window, args);
  let message = args.join(' ');
  let p = document.createElement('p');
  p.textContent = `${new Date()}: ${message}`;
  diagnostic.appendChild(p);

  diagnostic.scrollTo(0,diagnostic.scrollHeight);
}
window.log = log;

messageLibrary.setRoot('hello');
messageLibrary.add('hello', new MessageNode(
  'hello',
  new ResponseNode(
    new Map([
      [new ResponseOption(['yes', 'maybe', 'sure', 'yeah']), 'need_help'],
      [new ResponseOption(['no', 'nah']), 'who_then'],
    ]),
    'hello'
  )
));
messageLibrary.add('who_then', new MessageNode(
  'who_then',
  new ResponseNode(
    new Map([]),
    'what_color'
  )
));
messageLibrary.add('need_help', new MessageNode(
  'need_help',
  new ResponseNode(
    new Map([]),
    'what_color'
  )
));
messageLibrary.add('what_color', new MessageNode(
  'what_color',
  new ResponseNode(
    new Map([
      [new ResponseOption(['red']), 'found_it'],
    ]),
    'are_you_sure'
  )
));
messageLibrary.add('are_you_sure', new MessageNode(
  'are_you_sure',
  new ResponseNode(
    new Map([
      [new ResponseOption(['red']), 'found_it'],
    ]),
    'are_you_sure'
  )
));
messageLibrary.add('found_it', new MessageNode(
  'found_it',
  new ResponseNode(
    new Map([]),
    '__finish'
  )
));
