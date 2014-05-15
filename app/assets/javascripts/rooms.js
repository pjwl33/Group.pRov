//SADFACE FOR GLOBAL VARIABLES - CREATING AUDIOCONTEXT AND PAIRS FOR NOTES AND KEYS REFERRING TO S3 BUCKET
var context = new webkitAudioContext() || new AudioContext();
var piano = [{key: 65, sound:'Piano/c3.mp3'}, {key: 83, sound: 'Piano/d3.mp3'}, {key: 68, sound:'Piano/e3.mp3'}, {key: 70, sound:'Piano/f3.mp3'}, {key: 71, sound:'Piano/g3.mp3'}, {key: 72, sound:'Piano/a3.mp3'}, {key: 74, sound:'Piano/b3.mp3'}, {key: 87, sound:'Piano/cs3.mp3'}, {key: 69, sound:'Piano/ds3.mp3'}, {key: 84, sound:'Piano/fs3.mp3'}, {key: 89, sound:'Piano/gs3.mp3'}, {key: 85, sound:'Piano/as3.mp3'}, {key: 75, sound:'Piano/c4.mp3'}];
var beats = [{key: 65, sound:'Kicks/Ac_K.wav'}, {key: 83, sound:'Kicks/Afr_Kick.wav'}, {key: 68, sound:'Kicks/Amb_K.wav'}, {key: 70, sound:'Kicks/Ban_K.wav'}, {key: 71, sound:'Kicks/Bar_K.wav'}, {key: 72, sound:'Kicks/Bck_K1.wav'}, {key: 74, sound:'Kicks/Bef_K.wav'}, {key: 75, sound:'Kicks/Ben_K.wav'}, {key: 76, sound:'Kicks/Bl_K.wav'}, {key: 87, sound:'Claps/Bg_Clp.wav'}, {key: 69, sound:'Claps/Crk_Clp.wav'}, {key: 84, sound:'Claps/Hnd_Clp2.wav'}, {key: 89, sound:'Claps/Lad_Clp.wav'}, {key: 85, sound:'Claps/Mpl_Clp.wav'}, {key: 79, sound:'Claps/Mxr_Clp.wav'}, {key: 80, sound:'Claps/Nc_Clp.wav'}];
var drums = [{key: 65, sound:'Kicks/Bmb_K.wav'}, {key: 83, sound:'Kicks/Bnc_K.wav'}, {key: 68, sound:'Kicks/Bnk_K.wav'}, {key: 70, sound:'Kicks/Bnk_K1.wav'}, {key: 71, sound:'Kicks/Brk_K1.wav'}, {key: 72, sound:'Kicks/Bub_K.wav'}, {key: 74, sound:'Snares/Aco_Snr.wav'}, {key: 75, sound:'Snares/Acu_Snr.wav'}, {key: 76, sound:'Snares/Blk_Snr.wav'}, {key: 87, sound:'Cymbols/CL_OHH1.wav'}, {key: 69, sound:'Cymbols/Hi_Crsh.wav'}, {key: 84, sound:'Cymbols/Lo_Crsh.wav'}, {key: 89, sound:'HiHats/Ac_H.wav'}, {key: 85, sound:'HiHats/Aki_H1.wav'}, {key: 79, sound:'Cymbols/Rev_Crsh.wav'}, {key: 80, sound:'Snares/Box_Snr2.wav'}];

//FETCHING TRACKS AND USERS THAT HAVE BEEN CONTRIBUTED TO THE ROOM
function getTracks(roomId) {
  console.log(roomId);
  $.ajax({
    url: '/get_tracks',
    method: 'GET',
    dataType: 'json',
    data: {
      room_id: roomId
    }
  }).done(function(data) {
    $('#room-tracks').empty();
    for (var i = 0; i < data.tracks.length; i++) {
      addTrack(data.tracks[i]);
    }
    $('#user-contributors').empty();
    for (var j = 0; j < data.users.length; j++) {
      $('#user-contributors').append($('<li>').text(data.users[j].name));
    }
  });
}

//CREATING QWERTYHANCOCK KEYBOARD
function startKeyboard() {
  var keyboard = new QwertyHancock({
   id: 'keyboard',
   width: 650,
   height: 170,
   octaves: 2,
   startNote: 'C4',
   whiteNotesColour: 'white',
   blackNotesColour: 'black',
   hoverColour: '#F6FA9C',
   keyboardLayout: 'en'
 });
}

//PLAYING SOUND BASED ON KEY PRESS
function playSound(key, sound) {
  if (this.event.keyCode == key) {
    var note = document.getElementsByClassName(sound)[0];
    note.play();
  }
}
//FOR RAPID FIRE PLAYING - ALLOWS USER TO PLAY SAME NOT OVER AGAIN
function stopSound(key, sound) {
  if (this.event.keyCode == key) {
    var note = document.getElementsByClassName(sound)[0];
    note.pause();
    note.currentTime = 0;
  }
}

//LOADING APPROPRIATE SOUND FILES FOR INSTRUMENT
function instrument(type) {
  $('.button').removeAttr('disabled');
  $('#instrument-list').remove();
  startKeyboard();
  var soundFiles;
  if (type == 'piano') {
    $('.room-name').text($('.room-name').text() + " - Piano");
    soundFiles = piano;
  } else if (type == 'beats') {
    $('.room-name').text($('.room-name').text() + " - Beats");
    soundFiles = beats;
  } else if (type == 'drums') {
    $('.room-name').text($('.room-name').text() + " - Drums");
    soundFiles = drums;
  }
  for (i = 0; i < soundFiles.length; i++) {
    var audio = new Audio();
    var key = soundFiles[i].key;
    var sound = soundFiles[i].sound;
    audio.src = 'https://s3.amazonaws.com/s3-ex-bucket/' + sound;
    audio.className = sound;
    var source = context.createMediaElementSource(audio);
    source.connect(context.destination);
    $('#sounds').append(audio);
    document.addEventListener('keydown', playSound.bind(this, key, sound));
    document.addEventListener('keyup', stopSound.bind(this, key, sound));
  }
}
