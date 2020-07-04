import AudioRecorder from 'audio-recorder-polyfill';
window.MediaRecorder = AudioRecorder;

const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');

var recorder;
var recordedData;

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
