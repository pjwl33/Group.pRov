var sequence = function (event) {
  if (event.keyCode >= 65 && event.keyCode <= 89) {
    sequence.data.push(event);
  }
};
sequence.data = [];

function instType() {
  var instrument;
  if ($('.room-name').text().search("Piano") >= 0) {
    instrument = "piano";
  } else if ($('.room-name').text().search("Beats") >= 0) {
    instrument = "beats";
  } else if ($('.room-name').text().search("Drums") >= 0) {
    instrument = "drums";
  }
  return instrument;
}

function startRecording() {
  console.log("Recording...");
  document.addEventListener('keydown',  sequence);
}

function stopRecording() {
  console.log("Stopped.");
  var keyTimes = [];
  for (var i = 0; i < sequence.data.length; i++) {
    keyTimes.push([sequence.data[i].which, sequence.data[i].timeStamp]);
  }
  console.log(keyTimes);
  $.ajax({
    url: '/tracks',
    method: 'POST',
    dataType: 'json',
    data: {
      room: $('.room-name').attr('id'),
      instrument: instType(),
      sequence: JSON.stringify(keyTimes)
    }
  }).done(function(data) {
    alert(data.msg);
    addTrack(data.object);
    document.removeEventListener('keydown', sequence);
    sequence.data = [];
  });
}

function addTrack(data) {
  var trackList = $('#room-tracks');
  var playButton = $('<i>').addClass('fa fa-play').attr('id', 'play_track_' + data.id);
  var stopButton = $('<i>').addClass('fa fa-stop').attr('id', 'stop_track_' + data.id);
  var loopButton = $('<i>').addClass('fa fa-refresh').attr('id', 'loop_track_' + data.id);
  var listItem = $('<li>').text("Track #: " + data.id);
  playButton.click(playTrack.bind(this, data));
  stopButton.click(stopTrack.bind(this, data));
  loopButton.click(loopTrack.bind(this, data));
  if (data.instrument !== null) {
    trackList.append(listItem.append(playButton).append(stopButton).append(loopButton));
  }
}

function trackSequence(track) {
  var intervals = [];
  var intString = (track.sequence.slice(1, -1).split("["));
  for (var i = 0; i < intString.length; i++) {
    if (intString[i] !== "") {
      var pairs = [];
      var keyPress = intString[i].slice(0, 2);
      var timeStamp = intString[i].split(",")[1].slice(0, -1);
      pairs.push(keyPress, timeStamp);
      intervals.push(pairs);
    }
  }
  return intervals;
}

function getSound(keyValue, keyNotePairs) {
  for (var i = 0; i < keyNotePairs.length; i++) {
    if (keyNotePairs[i].key == keyValue) {
      return keyNotePairs[i].sound;
    }
  }
}

function playNotes(key, int, instrument, playType) {
  setTimeout(function() {
    var sound;
    if (instrument == "piano") {
      sound = getSound(key, piano);
    } else if (instrument == "beats") {
      sound = getSound(key, beats);
    } else if (instrument == "drums") {
      sound = getSound(key, drums);
    }
    var audio = new Audio();
    var source = context.createMediaElementSource(audio);
    audio.src = 'https://s3.amazonaws.com/s3-ex-bucket/' + sound;
    source.connect(context.destination);
    if (playType == "play") {
      audio.play();
    } else if (playType == "loop") {
      // audio.loop = true;
      // audio.play(this.src);
    }
  }, int);
}

function playTrack(track) {
  console.log("I'm playing!");
  var intervals = trackSequence(track);
  for (var i = 0; i < intervals.length; i++) {
    var key = intervals[i][0];
    var timeInt = intervals[i][1] - intervals[0][1];
    playNotes(key, timeInt, track.instrument, "play");
  }
}

function stopTrack(track) {
  console.log("Staph...");
}

function loopTrack(track) {
  console.log("Round and around");
  var intervals = trackSequence(track);
  for (var i = 0; i < intervals.length; i++) {
    var key = intervals[i][0];
    var timeInt = intervals[i][1] - intervals[0][1];
    playNotes(key, timeInt, track.instrument, "loop");
  }
}

