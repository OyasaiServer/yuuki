#include <napi.h>
#include <cctype>
#include <iomanip>
#include <sstream>
#include <string>

using namespace std;

string url_encode(const string &value) {
    ostringstream escaped;
    escaped.fill('0');
    escaped << hex;

    for (string::const_iterator i = value.begin(), n = value.end(); i != n; ++i) {
        string::value_type c = (*i);

        // Keep alphanumeric and other accepted characters intact
        if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
            escaped << c;
            continue;
        }

        // Any other characters are percent-encoded
        escaped << uppercase;
        escaped << '%' << setw(2) << int((unsigned char) c);
        escaped << nouppercase;
    }

    return escaped.str();
}

Napi::Value encode(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() > 1) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  return Napi::String::New(env, url_encode(info[0].As<Napi::String>().ToString()));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "encode"), Napi::Function::New(env, encode));
  return exports;
}

NODE_API_MODULE(addon, Init)