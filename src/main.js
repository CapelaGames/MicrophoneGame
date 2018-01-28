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


library.setRoot('01_sorry_to_bother');


//
//  Conversation 01
//
library.add('01_sorry_to_bother', new MessageNode(
  '01_sorry_to_bother',
  new ResponseNode(
    new Map([
      [new ResponseOption(['red']), '01A_RED_just_paid_me'],
      [new ResponseOption(['green']), '01B_GREEN_yelling_about_the_paint'],
    ]),
    '01C_OTHER_i_think_its_green'
  ),
  'startCall:jimmy',
));
library.add('01A_RED_just_paid_me', new MessageNode(
  '01A_RED_just_paid_me',
  new ResponseNode(
    new Map([]),
    '02_where_are_lawnmowers'
  )
));
library.add('01B_GREEN_yelling_about_the_paint', new MessageNode(
  '01B_GREEN_yelling_about_the_paint',
  new ResponseNode(
    new Map([]),
    '02_where_are_lawnmowers'
  )
));
library.add('01C_OTHER_i_think_its_green', new MessageNode(
  '01C_OTHER_i_think_its_green',
  new ResponseNode(
    new Map([]),
    '02_where_are_lawnmowers'
  )
));

//
//  Conversation 02
//
library.add('02_where_are_lawnmowers', new MessageNode(
  '02_where_are_lawnmowers',
  new ResponseNode(
    new Map([
      [new ResponseOption(['one', 'two', 'three', '1', '2', '3']), '02A_thanks_boss'],
    ]),
    '02B_found_it_himself'
  ),
  'startCall:jimmy',
));
library.add('02A_thanks_boss', new MessageNode(
  '02A_thanks_boss',
  new ResponseNode(
    new Map([]),
    '03_inspector'
  )
));
library.add('02B_found_it_himself', new MessageNode(
  '02B_found_it_himself',
  new ResponseNode(
    new Map([]),
    '03_inspector'
  )
));

//
//  Conversation 03
//
library.add('03_inspector', new MessageNode(
  '03_inspector',
  new ResponseNode(
    new Map([]),
    '04_two_things'
  ),
  'startCall:inspector',
));

//
//  Conversation 04
//
library.add('04_two_things', new MessageNode(
  '04_two_things',
  new ResponseNode(
    new Map([]),
    '05_clean_and_safe'
  ),
  'startCall:jimmy',
));

//
// Conversation 05
//
library.add('05_clean_and_safe', new MessageNode(
  '05_clean_and_safe',
  new ResponseNode(
    new Map([
      [new ResponseOption(['no', 'not', 'nah', 'nup', 'nope']), '05B_cant_deal'],
      [new ResponseOption(['yes', 'promise', 'yeah', 'yup']), '05A_thanks_boss'],
    ]),
    '05B_cant_deal'
  )
));
library.add('05A_thanks_boss', new MessageNode(
  '05A_thanks_boss',
  new ResponseNode(
    new Map([
      [new ResponseOption(['outside', 'out']), '06_okay_great_OUTSIDE'],
      [new ResponseOption(['inside', 'in', 'coincide']), '06_okay_great_INSIDE'],
    ]),
    '06_good_inside'
  )
));
library.add('05B_cant_deal', new MessageNode(
  '05B_cant_deal',
  new ResponseNode(
    new Map([
      [new ResponseOption(['outside', 'out']), '06_okay_great_OUTSIDE'],
      [new ResponseOption(['inside', 'in']), '06_okay_great_INSIDE'],
    ]),
    '06_good_inside'
  )
));


//
// Conversation 07 INSIDE
//
library.add('06_good_inside', new MessageNode(
  '06_good_inside',
  new ResponseNode(
    new Map([]),
    '07IN_staff_or_camping'
  )
));
library.add('06_okay_great_INSIDE', new MessageNode(
  '06_okay_great',
  new ResponseNode(
    new Map([]),
    '07IN_staff_or_camping'
  )
));
library.add('07IN_staff_or_camping', new MessageNode(
  '07IN_staff_or_camping',
  new ResponseNode(
    new Map([
      [new ResponseOption(['staff', 'staffroom', 'room']), '07IN_staffroom'],
      [new ResponseOption(['camp', 'camping', 'tent']), '07IN_tent'],
    ]),
    '07IN_tent_afternoresponse'
  )
));
library.add('07IN_staffroom', new MessageNode(
  '07IN_staffroom',
  new ResponseNode(
    new Map([]),
    '08_get_some_gear'
  )
));
library.add('07IN_tent', new MessageNode(
  '07IN_tent',
  new ResponseNode(
    new Map([]),
    '08_get_some_gear'
  )
));
library.add('07IN_tent_afternoresponse', new MessageNode(
  '07IN_tent_afternoresponse',
  new ResponseNode(
    new Map([]),
    '08_get_some_gear'
  )
));

//
// Conversation 07 OUTSIDE
//
library.add('06_okay_great_OUTSIDE', new MessageNode(
  '06_okay_great',
  new ResponseNode(
    new Map([]),
    '07OUT_bin_or_kennel'
  )
));
library.add('07OUT_bin_or_kennel', new MessageNode(
  '07OUT_bin_or_kennel',
  new ResponseNode(
    new Map([
      [new ResponseOption(['bin', 'trash', 'rubbish']), '07OUT_bin'],
      [new ResponseOption(['kennel', 'dog', 'outdoor', 'living']), '07OUT_kennel'],
    ]),
    '07OUT_kennel_afternoresponse'
  )
));
library.add('07OUT_bin', new MessageNode(
  '07OUT_bin',
  new ResponseNode(
    new Map([]),
    '08_get_some_gear'
  )
));
library.add('07OUT_kennel', new MessageNode(
  '07OUT_kennel',
  new ResponseNode(
    new Map([]),
    '08_get_some_gear'
  )
));
library.add('07OUT_kennel_afternoresponse', new MessageNode(
  '07OUT_kennel_afternoresponse',
  new ResponseNode(
    new Map([]),
    '08_get_some_gear'
  )
));


//
// Conversation 08 OUTSIDE
//
library.add('08_get_some_gear', new MessageNode(
  '08_get_some_gear',
  new ResponseNode(
    new Map([]),
    '09_inspector_coming_soon'
  )
));


//
//  Conversation 09
//
library.add('09_inspector_coming_soon', new MessageNode(
  '09_inspector_coming_soon',
  new ResponseNode(
    new Map([]),
    '10_what_should_i_ditch'
  ),
  'startCall:inspector',
));


//
//  Conversation 10
//
library.add('10_what_should_i_ditch', new MessageNode(
  '10_what_should_i_ditch',
  new ResponseNode(
    new Map([
      [new ResponseOption(['mop']), '10A_no_mop'],
      [new ResponseOption(['bucket']), '10B_no_bucket'],
      [new ResponseOption(['water']), '10C_no_water'],
      [new ResponseOption(['soap']), '10D_no_soap'],
    ]),
    '10E_other'
  ),
  'startCall:jimmy',
));
library.add('10A_no_mop', new MessageNode(
  '10A_no_mop',
  new ResponseNode(
    new Map([]),
    '11_tea_or_coffee'
  ),
  'scoreTest:1:lose'
));
library.add('10B_no_bucket', new MessageNode(
  '10B_no_bucket',
  new ResponseNode(
    new Map([]),
    '11_tea_or_coffee'
  ),
  'scoreTest:1:win'
));
library.add('10C_no_water', new MessageNode(
  '10C_no_water',
  new ResponseNode(
    new Map([]),
    '11_tea_or_coffee'
  ),
  'scoreTest:1:lose'
));
library.add('10D_no_soap', new MessageNode(
  '10D_no_soap',
  new ResponseNode(
    new Map([]),
    '11_tea_or_coffee'
  ),
  'scoreTest:1:win'
));
library.add('10E_other', new MessageNode(
  '10E_other',
  new ResponseNode(
    new Map([]),
    '11_tea_or_coffee'
  ),
  'scoreTest:1:lose'
));


//
//  Conversation 11-13
//
library.add('11_tea_or_coffee', new MessageNode(
  '11_tea_or_coffee',
  new ResponseNode(
    new Map([
      [new ResponseOption(['tea', 't', 'the']), '12_making_it_TEA'],
      [new ResponseOption(['coffee', 'beans', 'espresso', 'bean juice', 'brown water', 'cough']), '12_making_it_COFFEE'],
    ]),
    '12_making_it_TEA'
  ),
));
library.add('12_making_it_COFFEE', new MessageNode(
  '12_making_it',
  new ResponseNode(
    new Map([]),
    '13B_made_some_coffee'
  ),
  'scoreTest:2:win'
));
library.add('12_making_it_TEA', new MessageNode(
  '12_making_it',
  new ResponseNode(
    new Map([]),
    '13A_made_some_tea'
  ),
  'scoreTest:2:lose'
));
library.add('13A_made_some_tea', new MessageNode(
  '13A_made_some_tea',
  new ResponseNode(
    new Map([]),
    '__score'
  )
));
library.add('13B_made_some_coffee', new MessageNode(
  '13B_made_some_coffee',
  new ResponseNode(
    new Map([]),
    '__score'
  )
));

//
//  Finish States
//
library.add('00_lose_1_lose_2', new MessageNode(
  '00_lose_1_lose_2',
  new ResponseNode(
    new Map([]),
    '00_end_state'
  ),
));
library.add('00_lose_1_win_2', new MessageNode(
  '00_lose_1_win_2',
  new ResponseNode(
    new Map([]),
    '00_end_state'
  ),
));
library.add('00_win_1_lose_2', new MessageNode(
  '00_win_1_lose_2',
  new ResponseNode(
    new Map([]),
    '00_end_state'
  ),
));
library.add('00_win_1_win_2', new MessageNode(
  '00_win_1_win_2',
  new ResponseNode(
    new Map([]),
    '00_end_state'
  ),
));

library.add('00_end_state', new MessageNode(
  '00_end_state',
  new ResponseNode(
    new Map([]),
    '00_blooper_1'
  ),
  'runCredits'
));

library.add('00_blooper_1', new MessageNode(
  '00_blooper_1',
  new ResponseNode(
    new Map([]),
    '00_blooper_2'
  ),
));

library.add('00_blooper_2', new MessageNode(
  '00_blooper_2',
  new ResponseNode(
    new Map([]),
    '00_blooper_3'
  ),
));

library.add('00_blooper_3', new MessageNode(
  '00_blooper_3',
  new ResponseNode(
    new Map([]),
    '00_blooper_4'
  ),
));

library.add('00_blooper_4', new MessageNode(
  '00_blooper_4',
  new ResponseNode(
    new Map([]),
    '__finish'
  ),
));
