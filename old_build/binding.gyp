{
  "targets": [
    {
      "target_name": "camera",
      "sources": [ "camera.cpp" ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    }
  ]
}
