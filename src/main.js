window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

if (window.SpeechRecognition) {
  window.library = new Library();
  window.game = new Game(library);
} else {
  document.body.classList.add('no-support');
}


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

diagnosticsButton.onclick = function() {
  diagnostic.style.display = 'block';
}

ready.onclick = function() {
  document.body.classList.add('phone-only');
}


library.add('jimmy', new CharacterNode(
  'Jimmy', 'Gummies Casual', 'images/jimmy.png'
));
library.add('inspector', new CharacterNode(
  'Inspector', 'Gummies Corporate', 'images/inspector.png'
));


library.setRoot('hello');
library.add('hello', new MessageNode(
  'hello',
  new ResponseNode(
    new Map([
      [new ResponseOption(['yes', 'maybe', 'sure', 'yeah']), 'need_help'],
      [new ResponseOption(['no', 'nah']), 'who_then'],
    ]),
    'hello'
  ),
  'startCall:Jimmy',
));
library.add('hello', new MessageNode(
  'hello',
  new ResponseNode(
    new Map([
      [new ResponseOption(['yes', 'maybe', 'sure', 'yeah']), 'need_help'],
      [new ResponseOption(['no', 'nah']), 'who_then'],
    ]),
    'hello'
  )
));
library.add('who_then', new MessageNode(
  'who_then',
  new ResponseNode(
    new Map([]),
    'what_color'
  )
));
library.add('need_help', new MessageNode(
  'need_help',
  new ResponseNode(
    new Map([]),
    'what_color'
  )
));
library.add('what_color', new MessageNode(
  'what_color',
  new ResponseNode(
    new Map([
      [new ResponseOption(['red']), 'found_it'],
    ]),
    'are_you_sure'
  )
));
library.add('are_you_sure', new MessageNode(
  'are_you_sure',
  new ResponseNode(
    new Map([
      [new ResponseOption(['red']), 'found_it'],
    ]),
    'are_you_sure'
  )
));
library.add('found_it', new MessageNode(
  'found_it',
  new ResponseNode(
    new Map([]),
    '__finish'
  )
));



library.add('hello', new MessageNode(
  'hello',
  new ResponseNode(
    new Map([
      [new ResponseOption(['yes', 'maybe', 'sure', 'yeah']), 'need_help'],
      [new ResponseOption(['no', 'nah']), 'who_then'],
    ]),
    'hello'
  ),
  'startCall:Unknown', // TODO: figure out what to show the inspector as
));
