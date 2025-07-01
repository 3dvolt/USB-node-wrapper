const { contextBridge } = require('electron');
const UVCControl = require('uvc-control');
const camera = new UVCControl();

contextBridge.exposeInMainWorld('cameraControls', {
  setBrightness: (value) => {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') return reject(new Error('Brightness must be a number'));
      camera.set('brightness', value, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  setAutoWhiteBalance: (enabled) => {
    return new Promise((resolve, reject) => {
      const autoFlag = enabled ? 1 : 0;
      camera.set('white_balance_temperature_auto', autoFlag, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
});
const usb = require('usb');

const listUvcDevices = () => {
  const devices = usb.getDeviceList();
  const uvcDevices = devices.filter(device => {
    // UVC devices usually have classCode 0x0e (14 decimal) for Video
    return device.deviceDescriptor.bDeviceClass === 239 ||  // 239 = Miscellaneous, often used
           device.deviceDescriptor.bDeviceSubClass === 2 || // Video Streaming subclass
           device.deviceDescriptor.bDeviceClass === 14;     // 14 = Video
  });

  uvcDevices.forEach((device, index) => {
    const desc = device.deviceDescriptor;
    console.log(`${index + 1}: VID_${desc.idVendor.toString(16)} PID_${desc.idProduct.toString(16)}`);
  });
};

listUvcDevices();
