//RECORDING SEQUENCE DATA OF KEYPRESSES AND TIMESTAMP
var sequence = function (event) {
  if (event.keyCode >= 65 && event.keyCode <= 89) {
    sequence.data.push(event);
  }
};
sequence.data = [];

//STARTING A RECORDING OF KEYPRESS AND TIMESTAMPS
function startRecording() {
  console.log("Recording...");
  document.addEventListener('keydown', sequence);
}

//CREATING A TRACK SEQUENCE BASED ON KEYPRESS AND TIMESTAMPS
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

//ADDING EACH TRACK TO BROWSER WITH PLAY FUNCTIONALITIES
function addTrack(data) {
  var trackList = $('#room-tracks');
  var playButton = $('<i>').addClass('fa fa-play').attr('id', 'play_track_' + data.id);
  var stopButton = $('<i>').addClass('fa fa-stop').attr('id', 'stop_track_' + data.id);
  var loopButton = $('<i>').addClass('fa fa-refresh').attr('id', 'loop_track_' + data.id);
  var listItem = $('<li>').text("Track #: " + data.id);
  playButton.click(trackFxn.bind(this, data, "play"));
  stopButton.click(trackFxn.bind(this, data, "stop"));
  loopButton.click(trackFxn.bind(this, data, "loop"));
  if (data.instrument !== null) {
    trackList.append(listItem.append(playButton).append(stopButton).append(loopButton));
  }
}

//CHECKING PLAYBACK INSTRUMENT TYPE - GLOBAL VARIABLE IN rooms.js
function instType() {
  var instrument;
  var roomName = $('.room-name').text();
  if (roomName.search("Piano") >= 0) {
    instrument = "piano";
  } else if (roomName.search("Beats") >= 0) {
    instrument = "beats";
  } else if (roomName.search("Drums") >= 0) {
    instrument = "drums";
  }
  return instrument;
}

//SPLITTING JSON DATA INTO TRACK SEQUENCE KEYPRESS, TIMESTAMP ARRAY PAIRS
function trackSequence(track) {
  var keyTimePairs = [];
  var intString = (track.sequence.slice(1, -1).split("["));
  for (var i = 0; i < intString.length; i++) {
    if (intString[i] !== "") {
      var pairs = [];
      var keyPress = intString[i].slice(0, 2);
      var timeStamp = intString[i].split(",")[1].slice(0, -1);
      pairs.push(keyPress, timeStamp);
      keyTimePairs.push(pairs);
    }
  }
  return keyTimePairs;
}

//GETTING APPROPRIATE SOUND FILE SOURCES FOR PLAYBACK
function getSound(keyValue, instType) {
  for (var i = 0; i < instType.length; i++) {
    if (instType[i].key == keyValue) {
      return instType[i].sound;
    }
  }
}

//PLAYING NOTES BACK ACCORDING TO KEYPRESS AND TIME INTERVAL - NO DURATION ACCOUNTED YET
function playNotes(key, int, instrument) {
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
  setTimeout(function() {audio.play();}, int);
}

//PLAY, STOP, LOOP FUNCTIONS FOR TRACKS
function trackFxn(track, style) {
  var keyTimePairs = trackSequence(track);
  for (var i = 0; i < keyTimePairs.length; i++) {
    var key = keyTimePairs[i][0];
    var time = keyTimePairs[i][1] - keyTimePairs[0][1];
    if (style == "play") {
      playNotes(key, time, track.instrument);
    } else if (style == "loop") {
      var totalTime = calcInts(keyTimePairs);
      console.log(totalTime);
      playNotes(key, time, track.instrument);
      setInterval(playNotes, totalTime, key, time, track.instrument);
    }
  }
}

function calcInts(pairs) {
  var result = 0;
  for (var i = 0; i < pairs.length; i++) {
    if (i !== 0) {
      result += (pairs[i][1] - pairs[i - 1][1]);
    }
  }
  return result;
}
