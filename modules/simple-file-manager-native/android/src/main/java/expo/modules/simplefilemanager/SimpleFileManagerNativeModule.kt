package expo.modules.simplefilemanager

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.Settings
import android.webkit.MimeTypeMap
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream

class SimpleFileManagerNativeModule : Module() {
  private val context
    get() = appContext.reactContext ?: throw IllegalStateException("React context unavailable")

  override fun definition() = ModuleDefinition {
    Name("SimpleFileManagerNative")

    Function("getRootPath") {
      @Suppress("DEPRECATION")
      Environment.getExternalStorageDirectory().absolutePath
    }

    Function("hasAllFilesAccess") {
      hasAllFilesAccess()
    }

    Function("openAllFilesAccessSettings") {
      openAllFilesAccessSettings()
      true
    }

    AsyncFunction("list") { path: String ->
      ensureExternalAccessIfNeeded(path)
      val dir = File(path)
      if (!dir.exists()) throw IllegalStateException("Klasör bulunamadı: $path")
      if (!dir.isDirectory) throw IllegalStateException("Bu yol klasör değil: $path")
      val files = dir.listFiles() ?: throw SecurityException("Klasör içeriği okunamadı: $path")
      files.map { file ->
        mapOf(
          "name" to file.name,
          "path" to file.absolutePath,
          "isDirectory" to file.isDirectory,
          "size" to if (file.isFile) file.length().toDouble() else 0.0,
          "lastModified" to file.lastModified().toDouble()
        )
      }
    }

    AsyncFunction("exists") { path: String ->
      File(path).exists()
    }

    AsyncFunction("mkdir") { path: String ->
      ensureExternalAccessIfNeeded(path)
      val file = File(path)
      if (file.exists()) throw IllegalStateException("Bu isimde bir öğe zaten var.")
      if (!file.mkdirs()) throw IllegalStateException("Klasör oluşturulamadı: $path")
      true
    }

    AsyncFunction("createFile") { path: String ->
      ensureExternalAccessIfNeeded(path)
      val file = File(path)
      if (file.exists()) throw IllegalStateException("Bu isimde bir öğe zaten var.")
      file.parentFile?.let { parent ->
        if (!parent.exists() && !parent.mkdirs()) throw IllegalStateException("Üst klasör oluşturulamadı.")
      }
      if (!file.createNewFile()) throw IllegalStateException("Dosya oluşturulamadı: $path")
      true
    }

    AsyncFunction("delete") { path: String ->
      ensureExternalAccessIfNeeded(path)
      val file = File(path)
      if (!file.exists()) return@AsyncFunction true
      deleteRecursive(file)
      true
    }

    AsyncFunction("copy") { source: String, destination: String ->
      ensureExternalAccessIfNeeded(source)
      ensureExternalAccessIfNeeded(destination)
      val src = File(source)
      val dst = File(destination)
      if (!src.exists()) throw IllegalStateException("Kaynak bulunamadı: $source")
      if (dst.exists()) throw IllegalStateException("Hedefte aynı isimde bir öğe zaten var.")
      copyRecursive(src, dst)
      true
    }

    AsyncFunction("move") { source: String, destination: String ->
      ensureExternalAccessIfNeeded(source)
      ensureExternalAccessIfNeeded(destination)
      val src = File(source)
      val dst = File(destination)

      // Aynı işlem UI tarafında çok hızlı iki kez tetiklenirse ilk çağrı kaynağı
      // taşımış olabilir. Hedef mevcut ve kaynak artık yoksa işlem tamamlanmıştır.
      if (!src.exists() && dst.exists()) return@AsyncFunction true
      if (!src.exists()) throw IllegalStateException("Kaynak bulunamadı: $source")
      if (dst.exists()) throw IllegalStateException("Hedefte aynı isimde bir öğe zaten var.")

      dst.parentFile?.let { parent ->
        if (!parent.exists() && !parent.mkdirs()) throw IllegalStateException("Hedef klasör hazırlanamadı.")
      }

      if (!src.renameTo(dst)) {
        copyRecursive(src, dst)
        deleteRecursive(src)
      }

      if (!dst.exists()) throw IllegalStateException("Taşıma tamamlanamadı: $destination")
      true
    }

    AsyncFunction("openFile") { path: String, mime: String ->
      ensureExternalAccessIfNeeded(path)
      val file = File(path)
      if (!file.exists() || !file.isFile) throw IllegalStateException("Dosya bulunamadı: $path")
      val authority = "${context.packageName}.simplefilemanager.fileprovider"
      val uri = FileProvider.getUriForFile(context, authority, file)
      val resolvedMime = if (mime.isNotBlank() && mime != "*/*") mime else guessMime(file.name)
      val intent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(uri, resolvedMime)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      if (intent.resolveActivity(context.packageManager) == null) {
        throw IllegalStateException("Bu dosya türünü açabilecek bir uygulama bulunamadı.")
      }
      context.startActivity(intent)
      true
    }

    AsyncFunction("getSettings") {
      val prefs = context.getSharedPreferences("simple_file_manager", 0)
      mapOf(
        "theme" to prefs.getString("theme", ""),
        "scale" to prefs.getFloat("scale", 1.0f).toDouble()
      )
    }

    AsyncFunction("saveSettings") { theme: String, scale: Double ->
      context.getSharedPreferences("simple_file_manager", 0)
        .edit()
        .putString("theme", theme)
        .putFloat("scale", scale.toFloat())
        .apply()
      true
    }
  }

  private fun hasAllFilesAccess(): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      Environment.isExternalStorageManager()
    } else {
      ContextCompat.checkSelfPermission(context, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED &&
        ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
    }
  }

  private fun openAllFilesAccessSettings() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return
    val packageUri = Uri.parse("package:${context.packageName}")
    val appIntent = Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, packageUri).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    val fallback = Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    try {
      context.startActivity(appIntent)
    } catch (_: Exception) {
      context.startActivity(fallback)
    }
  }

  private fun ensureExternalAccessIfNeeded(path: String) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return
    @Suppress("DEPRECATION")
    val root = Environment.getExternalStorageDirectory().absolutePath
    val absolute = File(path).absolutePath
    if (absolute.startsWith(root) && !Environment.isExternalStorageManager()) {
      throw SecurityException("Tüm dosyalara erişim izni kapalı.")
    }
  }

  private fun copyRecursive(source: File, destination: File) {
    if (source.isDirectory) {
      if (!destination.exists() && !destination.mkdirs()) {
        throw IllegalStateException("Klasör oluşturulamadı: ${destination.absolutePath}")
      }
      val children = source.listFiles() ?: throw SecurityException("Klasör okunamadı: ${source.absolutePath}")
      children.forEach { child ->
        copyRecursive(child, File(destination, child.name))
      }
    } else {
      destination.parentFile?.let { parent ->
        if (!parent.exists() && !parent.mkdirs()) throw IllegalStateException("Hedef klasör oluşturulamadı.")
      }
      FileInputStream(source).use { input ->
        FileOutputStream(destination).use { output ->
          input.copyTo(output, 1024 * 1024)
          output.flush()
        }
      }
      destination.setLastModified(source.lastModified())
    }
  }

  private fun deleteRecursive(file: File) {
    if (file.isDirectory) {
      val children = file.listFiles() ?: throw SecurityException("Klasör okunamadı: ${file.absolutePath}")
      children.forEach { deleteRecursive(it) }
    }
    if (!file.delete()) throw IllegalStateException("Silinemedi: ${file.absolutePath}")
  }

  private fun guessMime(name: String): String {
    val extension = name.substringAfterLast('.', "").lowercase()
    return MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension) ?: "*/*"
  }
}
