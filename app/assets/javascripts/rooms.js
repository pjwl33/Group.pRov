var context = new webkitAudioContext() || new AudioContext();
var piano = [{key: 65, sound:'Piano/piano_c.wav'}, {key: 83, sound: 'Piano/piano_d.wav'}, {key: 68, sound:'Piano/piano_e.wav'}, {key: 70, sound:'Piano/piano_f.wav'}, {key: 71, sound:'Piano/piano_g.wav'}, {key: 72, sound:'Piano/piano_a.wav'}, {key: 74, sound:'Piano/piano_b.wav'}, {key: 87, sound:'Piano/piano_cs.wav'}, {key: 69, sound:'Piano/piano_eb.wav'}, {key: 84, sound:'Piano/piano_fs.wav'}, {key: 89, sound:'Piano/piano_gs.wav'}, {key: 85, sound:'Piano/piano_bb.wav'}];
var beats = [{key: 65, sound:'Kicks/Ac_K.wav'}, {key: 83, sound:'Kicks/Afr_Kick.wav'}, {key: 68, sound:'Kicks/Amb_K.wav'}, {key: 70, sound:'Kicks/Ban_K.wav'}, {key: 71, sound:'Kicks/Bar_K.wav'}, {key: 72, sound:'Kicks/Bck_K1.wav'}, {key: 74, sound:'Kicks/Bef_K.wav'}, {key: 75, sound:'Kicks/Ben_K.wav'}, {key: 76, sound:'Kicks/Bl_K.wav'}, {key: 87, sound:'Claps/Bg_Clp.wav'}, {key: 69, sound:'Claps/Crk_Clp.wav'}, {key: 84, sound:'Claps/Hnd_Clp2.wav'}, {key: 89, sound:'Claps/Lad_Clp.wav'}, {key: 85, sound:'Claps/Mpl_Clp.wav'}, {key: 79, sound:'Claps/Mxr_Clp.wav'}, {key: 80, sound:'Claps/Nc_Clp.wav'}];
var drums = [{key: 65, sound:'Kicks/Bmb_K.wav'}, {key: 83, sound:'Kicks/Bnc_K.wav'}, {key: 68, sound:'Kicks/Bnk_K.wav'}, {key: 70, sound:'Kicks/Bnk_K1.wav'}, {key: 71, sound:'Kicks/Brk_K1.wav'}, {key: 72, sound:'Kicks/Bub_K.wav'}, {key: 74, sound:'Snares/Aco_Snr.wav'}, {key: 75, sound:'Snares/Acu_Snr.wav'}, {key: 76, sound:'Snares/Blk_Snr.wav'}, {key: 87, sound:'Cymbols/CL_OHH1.wav'}, {key: 69, sound:'Cymbols/Hi_Crsh.wav'}, {key: 84, sound:'Cymbols/Lo_Crsh.wav'}, {key: 89, sound:'HiHats/Ac_H.wav'}, {key: 85, sound:'HiHats/Aki_H1.wav'}, {key: 79, sound:'Cymbols/Rev_Crsh.wav'}, {key: 80, sound:'Snares/Box_Snr2.wav'}];

function instrument(type) {
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
    audio.id = key;
    audio.className = sound;
    var source = context.createMediaElementSource(audio);
    source.connect(context.destination);
    $('#sounds').append(audio);
    document.addEventListener('keydown', playSound.bind(this, key, sound));
  }
}

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

function playSound(key, sound) {
  if (this.event.keyCode == key) {
    document.getElementsByClassName(sound)[0].play();
  }
}




