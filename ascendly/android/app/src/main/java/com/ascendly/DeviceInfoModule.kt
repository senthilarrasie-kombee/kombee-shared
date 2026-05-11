package com.ascendly

import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

import com.ascendly.NativeAscendlyDeviceInfoSpec

class DeviceInfoModule(reactContext: ReactApplicationContext) : NativeAscendlyDeviceInfoSpec(reactContext) {

    companion object {
        const val NAME = "AscendlyDeviceInfo"
    }

    override fun getDeviceInfo(promise: Promise) {
        try {
            val map: WritableMap = Arguments.createMap()
            map.putString("model", Build.MODEL ?: "")
            map.putString("device", Build.DEVICE ?: "")
            map.putString("brand", Build.BRAND ?: "")
            map.putString("product", Build.PRODUCT ?: "")
            map.putString("manufacturer", Build.MANUFACTURER ?: "")
            map.putInt("sdk", Build.VERSION.SDK_INT)
            
            android.util.Log.d("DeviceInfoModule", "Fetched Device Info: Model=${Build.MODEL}, SDK=${Build.VERSION.SDK_INT}")
            
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("ERROR_GETTING_DEVICE_INFO", e)
        }
    }
}
