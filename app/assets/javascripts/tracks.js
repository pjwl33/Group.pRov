//STARTING A RECORDING OF KEYPRESS AND TIMESTAMPS
function startRecording() {
  console.log("Recording...");
  document.addEventListener('keydown', sequence);
}

//RECORDING SEQUENCE DATA OF KEYPRESSES AND TIMESTAMP
var sequence = function (event) {
  if (event.keyCode >= 65 && event.keyCode <= 89) {
    sequence.data.push(event);
  }
};
sequence.data = [];

//CREATING A TRACK SEQUENCE BASED ON KEYPRESS AND TIMESTAMPS
function stopRecording() {
  console.log("Stopped.");
  var keyTimes = [];
  for (var i = 0; i < sequence.data.length; i++) {
    keyTimes.push([sequence.data[i].which, sequence.data[i].timeStamp]);
  }
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

//ADDING EACH TRACK TO BROWSER WITH PLAY FUNCTIONALITIES
function addTrack(track) {
  var trackList = $('#room-tracks');
  // var selectTag = $('<input>').attr('type', 'checkbox').attr('checked', 'checked');
  var playButton = $('<i>').addClass('fa fa-play');
  var stopButton = $('<i>').addClass('fa fa-stop');
  var loopButton = $('<i>').addClass('fa fa-refresh');
  var listItem = $('<li>').attr('id', 'track_' + track.id).text("Track #" + track.id + ": ");
  playButton.click(trackFxn.bind(this, track, "play"));
  stopButton.click(trackFxn.bind(this, track, "stop"));
  loopButton.click(trackFxn.bind(this, track, "loop"));
  if (track.instrument !== null) {
    trackList.append(listItem.append(playButton).append(stopButton).append(loopButton));
  }
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
      playNotes(key, time, track.instrument);
      //ADDED .5 SECONDS TO DECREASE CLUSTERF**K OVERLAP
      setInterval(playNotes, (totalTime + 500), key, time, track.instrument);
    } else if (style == "stop") {
      console.log("PLEASE DON'T STOP THE MUSIC, MUSIC!");
    }
  }
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

//GETTING APPROPRIATE SOUND FILE SOURCES FOR PLAYBACK
function getSound(keyValue, instType) {
  for (var i = 0; i < instType.length; i++) {
    if (instType[i].key == keyValue) {
      return instType[i].sound;
    }
  }
}

//CALCULATING TOTAL TIME INTERVAL FOR LOOPING
function calcInts(pairs) {
  var result = 0;
  for (var i = 0; i < pairs.length; i++) {
    if (i !== 0) {
      result += (pairs[i][1] - pairs[i - 1][1]);
    }
  }
  return result;
}

//PLAYING ALL/SELECTIONS
function playSelect(style) {
  var roomTracks = $('#room-tracks').children();
  for (var i = 0; i < roomTracks.length; i++) {
    // roomTracks.eq(i).children().eq(3).attr('checked')
    if (style == 'play') {
      roomTracks.eq(i).children().eq(0).click();
    } else if (style == 'loop') {
      roomTracks.eq(i).children().eq(2).click();
    }
  }
}
