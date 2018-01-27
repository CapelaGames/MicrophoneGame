var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

let grammar = '#JSGF V1.0; grammar colors; public <greeting> = yes | yeah | yup | no | nope | nah ;';

let recognition = new SpeechRecognition();
// let speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-AU';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

record.onmousedown = function() {
  recognition.start();
  console.log('Ready to receive a command.');
}

record.onmouseup = function() {
  //recognition.stop();
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  let last = event.results.length - 1;
  let transcript = event.results[last][0].transcript;

  diagnostic.textContent = 'Result received: ' + transcript + '.';
  console.log('Results:', event.results);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
