var sequence = function (event) {
  sequence.data.push(event);
};
sequence.data = [];

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
      instrument: checkInstrument(),
      sequence: JSON.stringify(keyTimes)
    }
  }).done(function(data) {
    console.log(data);
    addTrack(data);
    document.removeEventListener('keydown', sequence);
    sequence.data = [];
  });
}

function checkInstrument() {
  var instrument;
  if ($('.room-name').text().search("Piano") >= 0) {
    instrument = "Piano";
  } else if ($('.room-name').text().search("Beats") >= 0) {
    instrument = "Beats";
  } else if ($('.room-name').text().search("Drums") >= 0) {
    instrument = "Drums";
  }
  return instrument;
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
  trackList.append(listItem.append(playButton).append(stopButton).append(loopButton));
}

function playTrack(track) {
  console.log("I'm playing!");
  console.log(track.sequence);
}

function stopTrack(track) {
  console.log("Chillin'...");
}

function loopTrack(track) {
  console.log("Round and around");
}


