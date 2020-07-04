import AudioRecorder from 'audio-recorder-polyfill';
window.MediaRecorder = AudioRecorder;

const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');
const shareButton = document.getElementById('share');
const downloadButton = document.getElementById('download');

var recorder;
var recordedData;

recordButton.addEventListener('click', () => {
  // Request permissions to record audio
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recorder = new MediaRecorder(stream)

    // Set record to <audio> when recording will be finished
    recorder.addEventListener('dataavailable', e => {
      // audio.src = URL.createObjectURL(e.data)
      console.log(e);
      console.log('Data type: ', e.data.type);
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

  const dataFile = {
    title: 'audio.wav',
    files: recordedData,
  };

  if (navigator.canShare && !navigator.canShare(dataFile)) {
    alert('Cannot share this data');
    return;
  }

  navigator.share(dataFile)
    .then(() => {
      console.log('Successful share')
    })
    .catch((error) => {
      console.log('Error sharing', error)
    });
});

downloadButton.addEventListener('click', () => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  const blobUrl = window.URL.createObjectURL(recordedData);
  a.href = blobUrl;
  a.download = 'audio.wav';
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  }, 0);
});
