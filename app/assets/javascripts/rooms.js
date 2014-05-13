function instrument(type) {
  var context = new webkitAudioContext();
  var soundFiles;
  var keyCodes = [81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85];
  if (type == "keyboard") {
    soundFiles = ['piano_c.wav', 'piano_cs.wav', 'piano_d.wav', 'piano_eb.wav', 'piano_e.wav', 'piano_f.wav', 'piano_fs.wav', 'piano_g.wav', 'piano_gs.wav', 'piano_a.wav', 'piano_bb.wav', 'piano_b.wav'];
  } else if (type == "hip-hop-beats") {

  }
  for (i = 0; i < soundFiles.length; i++) {
    var audio = new Audio();
    audio.src = 'https://s3.amazonaws.com/s3-ex-bucket/Piano' + soundFiles[i];
    audio.id = soundFiles[i];
    var source = context.createMediaElementSource(audio);
    source.connect(context.destination);
    $('#sounds').append(audio);
    $(document).keydown(function(e) {
      if (e.keyCode == 81) {
        document.getElementById('piano_c.wav').play();
        // return false;
      } else if (e.keyCode == 50) {
        document.getElementById('piano_cs.wav').play();
      }
    });
  }
}

function tester() {
  var keyboard = QwertyHancock({id: 'keyboard'});

  var context = new AudioContext();

  /* VCO */
  var vco = context.createOscillator();
  vco.type = vco.SINE;
  vco.frequency.value = this.frequency;
  vco.start(0);

  /* VCA */
  var vca = context.createGain();
  vca.gain.value = 0;

  /* Connections */
  vco.connect(vca);
  vca.connect(context.destination);

  var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
  };

  var depressed_keys = {};

  keyboard.keyDown(function (note, frequency) {
    vco.frequency.value = frequency;
    vca.gain.value = 1;
    depressed_keys[note] = true;
  });

  keyboard.keyUp(function (note, _) {
    delete depressed_keys[note];
    if (isEmpty(depressed_keys)) {
      vca.gain.value = 0;
    }
  });
}
