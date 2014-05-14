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
    method: 'post',
    dataType: 'json',
    data: {
      room: $('.room-name').attr('id'),
      instrument: instType(),
      sequence: JSON.stringify(keyTimes)
    }
  }).done(function(data) {
    alert(data.msg);
    addTrack(data);
    document.removeEventListener('keydown', sequence);
    sequence.data = [];
  });
}

function addTrack(data) {
  var trackList = $('#room-tracks');
  var playButton = $('<i>').addClass('fa fa-play').attr('id', 'play_track_' + data.object.id);
  var stopButton = $('<i>').addClass('fa fa-stop').attr('id', 'stop_track_' + data.object.id);
  var loopButton = $('<i>').addClass('fa fa-refresh').attr('id', 'loop_track_' + data.object.id);
  var listItem = $('<li>').text("Track #: " + data.object.id);
  playButton.click(playTrack.bind(this, data.object));
  stopButton.click(stopTrack.bind(this, data.object));
  loopButton.click(loopTrack.bind(this, data.object));
  if (data.object.instrument !== null) {
    trackList.append(listItem.append(playButton).append(stopButton).append(loopButton));
  }
}

function playTrack(track) {
  console.log("I'm playing!");
  var audio = new Audio();
  // audio.src =
  audio.id = "track_" + track.id;
  var source = context.createMediaElementSource(audio);
  source.connect(context.destination);
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
  function playNotes(key, int) {
    setTimeout(function() { console.log(key);}, int);
  }
  for (var j = 0; j < intervals.length; j++) {
    var key = intervals[j][0];
    var timeInt = intervals[j][1] - intervals[0][1];
    playNotes(key, timeInt);
  }
}

function stopTrack(track) {
  console.log("Chillin'...");
}

function loopTrack(track) {
  console.log("Round and around");
}


