#include <napi.h>
#include <dshow.h>
#include <iostream>

#pragma comment(lib, "strmiids.lib")
#pragma comment(lib, "quartz.lib")

void SetCameraBrightness(long value) {
    HRESULT hr;
    ICreateDevEnum* pDevEnum = nullptr;
    IEnumMoniker* pEnum = nullptr;

    hr = CoInitializeEx(nullptr, COINIT_MULTITHREADED);
    if (FAILED(hr)) return;

    hr = CoCreateInstance(CLSID_SystemDeviceEnum, nullptr, CLSCTX_INPROC_SERVER,
                          IID_ICreateDevEnum, (void**)&pDevEnum);
    if (FAILED(hr)) return;

    hr = pDevEnum->CreateClassEnumerator(CLSID_VideoInputDeviceCategory, &pEnum, 0);
    if (hr != S_OK) return;

    IMoniker* pMoniker = nullptr;
    if (pEnum->Next(1, &pMoniker, nullptr) != S_OK) return;

    IBaseFilter* pCapFilter = nullptr;
    hr = pMoniker->BindToObject(nullptr, nullptr, IID_IBaseFilter, (void**)&pCapFilter);
    if (FAILED(hr)) return;

    IAMVideoProcAmp* pProcAmp = nullptr;
    hr = pCapFilter->QueryInterface(IID_IAMVideoProcAmp, (void**)&pProcAmp);
    if (FAILED(hr)) return;

    pProcAmp->Set(VideoProcAmp_Brightness, value, VideoProcAmp_Flags_Manual);

    pProcAmp->Release();
    pCapFilter->Release();
    pMoniker->Release();
    pEnum->Release();
    pDevEnum->Release();
    CoUninitialize();
}

Napi::Value SetBrightnessWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    long value = info[0].As<Napi::Number>().Int32Value();
    SetCameraBrightness(value);
    return env.Null();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("setBrightness", Napi::Function::New(env, SetBrightnessWrapped));
    return exports;
}

NODE_API_MODULE(camera, Init)
