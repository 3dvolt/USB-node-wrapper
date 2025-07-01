document.getElementById('brightnessSlider').addEventListener('input', (e) => {
  const value = parseInt(e.target.value);
  window.cameraControls.setBrightness(value)
    .then(() => console.log('Brightness set'))
    .catch(console.error);
});

document.getElementById('autoWhiteBalanceToggle').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  window.cameraControls.setAutoWhiteBalance(enabled)
    .then(() => console.log('White balance set'))
    .catch(console.error);
});

navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    console.log('Connected video input devices:');
    videoDevices.forEach((device, index) => {
      console.log(`${index + 1}: ${device.label} (ID: ${device.deviceId})`);
    });
  })
  .catch(console.error);

const TARGET_DEVICE_ID = '356efd5592330bc9c8be880e633491bfb9e1cca1054a8bec43445ef62c26927c';

async function startCamera(deviceId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } }
    });

    const video = document.getElementById('cameraPreview');
    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.error('Error accessing camera:', err);
  }
}

// Start the camera automatically
startCamera(TARGET_DEVICE_ID);


