import AudioRecorder from 'audio-recorder-polyfill'
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder'

const audiotypeRadios = document.getElementsByName('audiotype');
const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');
const shareButton = document.getElementById('share');
const downloadButton = document.getElementById('download');
const messageDiv = document.getElementById('message');

var recorder;
var recordedData;
var audiotype;

window.MediaRecorder = AudioRecorder;

const defaultEncoder = AudioRecorder.encoder;
const defaultMimeType = AudioRecorder.prototype.mimeType;

function logMessage(message) {
  console.log(message);

  const newDiv = document.createElement('div');
  newDiv.innerText = message;
  messageDiv.appendChild(newDiv);
}

function swithRecorder(type) {
  logMessage('Switching to ' + type);
  if (type === 'default') {
    audiotype = 'default';
    AudioRecorder.encoder = defaultEncoder;
    AudioRecorder.prototype.mimeType = defaultMimeType;
  } else if (type === 'mp3') {
    audiotype = 'mp3';
    AudioRecorder.encoder = mpegEncoder;
    AudioRecorder.prototype.mimeType = 'audio/mpeg';
  } else {
    logMessage('No such recorder type', type);
  }
}

function generateFilename() {
  switch (audiotype) {
    case 'default':
      return 'audio.wav';
    case 'mp3':
      return 'audio.mp3';
    default:
      logMessage('No such recorder type', audiotype);
  }
};

audiotypeRadios.forEach((radio) => {
  radio.addEventListener('click', (event) => {
    swithRecorder(event.target.value);
  });
});

recordButton.addEventListener('click', () => {
  // Request permissions to record audio
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recorder = new MediaRecorder(stream)

    // Set record to <audio> when recording will be finished
    recorder.addEventListener('dataavailable', e => {
      // audio.src = URL.createObjectURL(e.data)
      recordedData = e.data;
    })

    // Start recording
    recorder.start()
  })
});

stopButton.addEventListener('click', () => {
  // Stop recording
  recorder.stop()
  // Remove "recording" icon from browser tab
  recorder.stream.getTracks().forEach(i => i.stop())
});

shareButton.addEventListener('click', () => {
  if (!navigator.share) {
    alert('Web Share API not supported.');
    return;
  }

  const recordedFile = new File([recordedData], generateFilename(), { type: recordedData.type });

  const fileData = {
    files: [recordedFile],
  };

  if (navigator.canShare && !navigator.canShare(fileData)) {
    alert('Cannot share this data');
    return;
  }

  navigator.share(fileData)
    .then(() => {
      logMessage('Successful share')
    })
    .catch((error) => {
      console.log(error);
      logMessage('Error sharing' + error)
    });
});

downloadButton.addEventListener('click', () => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  const blobUrl = window.URL.createObjectURL(recordedData);
  a.href = blobUrl;
  a.download = generateFilename();
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  }, 0);
});
