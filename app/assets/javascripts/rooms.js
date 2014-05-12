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
    audio.src = 'https://s3.amazonaws.com/s3-ex-bucket/' + soundFiles[i];
    audio.id = soundFiles[i];
    var source = context.createMediaElementSource(audio);
    source.connect(context.destination);
    $('#sounds').append(audio);
    $(document).keydown(function(e) {
      if (e.keyCode == keyCodes[i]) {
        document.getElementById(soundFiles[i]).play();
        return false;
      }
    });
  }
}

