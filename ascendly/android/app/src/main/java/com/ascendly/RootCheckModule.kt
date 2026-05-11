package com.ascendly

import android.app.ActivityManager
import android.content.Context
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.BufferedReader
import java.io.File
import java.io.FileInputStream
import java.io.FileNotFoundException
import java.io.IOException
import java.io.InputStreamReader
import java.net.InetSocketAddress
import java.net.Socket

class RootCheckModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val manager: ActivityManager = reactContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager

    override fun getName(): String {
        return "RootCheckModule"
    }

    @ReactMethod
    fun isDeviceRooted(message: String, promise: Promise) {
        val isRooted = checkRootMethod1() || checkRootMethod2() || checkRootMethod3() || checkRootMethod4() || isFridaServerRunning()
        promise.resolve(isRooted)
    }

    fun isFridaServerRunning(): Boolean {
        val FRIDA_IP = "127.0.0.1"
        val FRIDA_PORT = 27042
        return try {
            val socket = Socket()
            socket.connect(InetSocketAddress(FRIDA_IP, FRIDA_PORT), 1000)
            socket.close()
            true
        } catch (e: IOException) {
            false
        }
    }

    private fun checkRootMethod1(): Boolean {
        Log.e("checkRootMethod1", "checkRootMethod1")
        val buildTags = Build.TAGS
        return buildTags != null && buildTags.contains("test-keys")
    }

    private fun checkRootMethod2(): Boolean {
        val paths = arrayOf("/system/app/Superuser.apk", "/sbin/su", "/system/bin/su", "/system/xbin/su", "/data/local/xbin/su", "/data/local/bin/su", "/system/sd/xbin/su", "/system/bin/failsafe/su", "/data/local/su")
        for (path in paths) {
            if (doesFileExist(path)) {
                return true
            }
        }
        return false
    }

    private fun checkRootMethod3(): Boolean {
        var process: Process? = null
        return try {
            process = Runtime.getRuntime().exec(arrayOf("/system/xbin/which", "su"))
            val `in` = BufferedReader(InputStreamReader(process.inputStream))
            `in`.readLine() != null
        } catch (t: Throwable) {
            false
        } finally {
            process?.destroy()
        }
    }

    private fun checkRootMethod4(): Boolean {
        return try {
            val binaryPaths = arrayOf("/system/xbin/su", "/system/bin/su", "/system/sbin/su", "/sbin/su", "/vendor/bin/su")
            for (path in binaryPaths) {
                if (doesFileExist(path)) {
                    return true
                }
            }
            val packageNames = arrayOf("com.koushikdutta.superuser", "eu.chainfire.supersu", "com.noshufou.android.su", "com.noshufou.android.su.elite", "eu.chainfire.supersu", "com.koushikdutta.superuser", "com.thirdparty.superuser", "com.yellowes.su", "com.koushikdutta.rommanager", "com.koushikdutta.rommanager.license", "com.dimonvideo.luckypatcher", "com.chelpus.lackypatch", "com.ramdroid.appquarantine", "com.ramdroid.appquarantinepro", "com.devadvance.rootcloak", "com.devadvance.rootcloakplus", "de.robv.android.xposed.installer", "com.saurik.substrate", "com.zachspong.temprootremovejb", "com.amphoras.hidemyroot", "com.amphoras.hidemyrootadfree", "com.formyhm.hiderootPremium", "com.formyhm.hideroot", "me.phh.superuser", "eu.chainfire.supersu.pro", "com.kingouser.com", "com.android.vending.billing.InAppBillingService.COIN", "com.topjohnwu.magisk")
            for (packageName in packageNames) {
                if (isPackageInstalled(packageName)) {
                    return true
                }
            }
            val process = Runtime.getRuntime().exec("getprop ro.build.tags")
            val bufferedReader = BufferedReader(InputStreamReader(process.inputStream))
            val buildTags = bufferedReader.readLine()
            process.destroy()
            buildTags != null && buildTags.contains("test-keys")
        } catch (e: Exception) {
            false
        }
    }

    private fun isPackageInstalled(packageName: String): Boolean {
        return try {
            reactApplicationContext.packageManager.getPackageInfo(packageName, 0)
            true
        } catch (e: Exception) {
            false
        }
    }

    companion object {
        fun doesFileExist(filePath: String): Boolean {
            val file = File(filePath)
            return try {
                file.canRead()
            } catch (e: SecurityException) {
                doesFileExist2(filePath)
            }
        }

        fun doesFileExist2(filePath: String): Boolean {
            val file = File(filePath)
            return try {
                val fis = FileInputStream(file)
                fis.close()
                true
            } catch (e: FileNotFoundException) {
                false
            } catch (e: Exception) {
                false
            }
        }
    }
}
