package expo.modules.simplefilemanager

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.storage.StorageManager
import android.provider.Settings
import android.webkit.MimeTypeMap
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.util.UUID

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

    AsyncFunction("getStorageRoots") {
      getStorageRoots()
    }

    AsyncFunction("list") { path: String ->
      ensureExternalAccessIfNeeded(path)
      val dir = File(path)
      if (!dir.exists()) throw IllegalStateException("Folder not found: $path")
      if (!dir.isDirectory) throw IllegalStateException("Path is not a folder: $path")
      val files = dir.listFiles() ?: throw SecurityException("Folder contents could not be read: $path")
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
      if (file.exists()) throw IllegalStateException("An item with this name already exists.")
      if (!file.mkdirs()) throw IllegalStateException("Folder could not be created: $path")
      true
    }

    AsyncFunction("createFile") { path: String ->
      ensureExternalAccessIfNeeded(path)
      val file = File(path)
      if (file.exists()) throw IllegalStateException("An item with this name already exists.")
      file.parentFile?.let { parent ->
        if (!parent.exists() && !parent.mkdirs()) throw IllegalStateException("Parent folder could not be created.")
      }
      if (!file.createNewFile()) throw IllegalStateException("File could not be created: $path")
      true
    }

    AsyncFunction("delete") { path: String ->
      ensureExternalAccessIfNeeded(path)
      val file = File(path)
      if (!file.exists()) return@AsyncFunction true
      deleteRecursive(file)
      true
    }

    AsyncFunction("copy") { source: String, destination: String, overwrite: Boolean ->
      ensureExternalAccessIfNeeded(source)
      ensureExternalAccessIfNeeded(destination)
      val src = File(source)
      val dst = File(destination)

      if (!src.exists()) throw IllegalStateException("Source not found: $source")
      if (sameFile(src, dst)) return@AsyncFunction true

      if (dst.exists()) {
        if (!overwrite) throw IllegalStateException("An item with the same name already exists at the destination.")
        replaceSafely(src, dst, deleteSource = false)
      } else {
        copyRecursive(src, dst)
      }
      true
    }

    AsyncFunction("move") { source: String, destination: String, overwrite: Boolean ->
      ensureExternalAccessIfNeeded(source)
      ensureExternalAccessIfNeeded(destination)
      val src = File(source)
      val dst = File(destination)

      // Aynı işlem UI tarafında çok hızlı iki kez tetiklenirse ilk çağrı kaynağı
      // taşımış olabilir. Hedef mevcut ve kaynak artık yoksa işlem tamamlanmıştır.
      if (!src.exists() && dst.exists()) return@AsyncFunction true
      if (!src.exists()) throw IllegalStateException("Source not found: $source")
      if (sameFile(src, dst)) return@AsyncFunction true

      if (dst.exists()) {
        if (!overwrite) throw IllegalStateException("An item with the same name already exists at the destination.")
        replaceSafely(src, dst, deleteSource = true)
        return@AsyncFunction true
      }

      dst.parentFile?.let { parent ->
        if (!parent.exists() && !parent.mkdirs()) throw IllegalStateException("Destination folder could not be prepared.")
      }

      if (!src.renameTo(dst)) {
        copyRecursive(src, dst)
        deleteRecursive(src)
      }

      if (!dst.exists()) throw IllegalStateException("Move could not be completed: $destination")
      true
    }

    AsyncFunction("openFile") { path: String, mime: String ->
      ensureExternalAccessIfNeeded(path)
      val file = File(path)
      if (!file.exists() || !file.isFile) throw IllegalStateException("File not found: $path")
      val authority = "${context.packageName}.simplefilemanager.fileprovider"
      val uri = FileProvider.getUriForFile(context, authority, file)
      val resolvedMime = if (mime.isNotBlank() && mime != "*/*") mime else guessMime(file.name)
      val intent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(uri, resolvedMime)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      if (intent.resolveActivity(context.packageManager) == null) {
        throw IllegalStateException("No application was found that can open this file type.")
      }
      context.startActivity(intent)
      true
    }

    AsyncFunction("getSettings") {
      val prefs = context.getSharedPreferences("simple_file_manager", 0)
      mapOf(
        "theme" to prefs.getString("theme", ""),
        "scale" to prefs.getFloat("scale", 1.0f).toDouble(),
        "language" to prefs.getString("language", "")
      )
    }

    AsyncFunction("saveSettings") { theme: String, scale: Double, language: String ->
      context.getSharedPreferences("simple_file_manager", 0)
        .edit()
        .putString("theme", theme)
        .putFloat("scale", scale.toFloat())
        .putString("language", language)
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

  private fun getStorageRoots(): List<Map<String, Any>> {
    val roots = linkedMapOf<String, Map<String, Any>>()
    @Suppress("DEPRECATION")
    val primaryPath = Environment.getExternalStorageDirectory().absolutePath
    roots[primaryPath] = mapOf(
      "label" to "Internal Storage",
      "path" to primaryPath,
      "removable" to false,
      "primary" to true
    )

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      val manager = context.getSystemService(Context.STORAGE_SERVICE) as StorageManager
      manager.storageVolumes.forEach { volume ->
        val directory = volume.directory ?: return@forEach
        val path = directory.absolutePath
        if (!directory.exists() || roots.containsKey(path)) return@forEach
        val removable = volume.isRemovable
        val primary = volume.isPrimary
        val label = when {
          primary -> "Internal Storage"
          removable -> "External Storage"
          else -> "Storage"
        }
        roots[path] = mapOf(
          "label" to label,
          "path" to path,
          "removable" to removable,
          "primary" to primary
        )
      }
    } else {
      context.getExternalFilesDirs(null).forEach { appDir ->
        if (appDir == null) return@forEach
        val marker = "/Android/data/${context.packageName}/files"
        val absolute = appDir.absolutePath
        val index = absolute.indexOf(marker)
        if (index <= 0) return@forEach
        val path = absolute.substring(0, index)
        if (roots.containsKey(path)) return@forEach
        val directory = File(path)
        if (!directory.exists()) return@forEach
        roots[path] = mapOf(
          "label" to "External Storage",
          "path" to path,
          "removable" to true,
          "primary" to false
        )
      }
    }

    return roots.values.toList()
  }

  private fun ensureExternalAccessIfNeeded(path: String) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return
    @Suppress("DEPRECATION")
    val root = Environment.getExternalStorageDirectory().absolutePath
    val absolute = File(path).absolutePath
    if (absolute.startsWith(root) && !Environment.isExternalStorageManager()) {
      throw SecurityException("All files access permission is disabled.")
    }
  }

  private fun sameFile(first: File, second: File): Boolean {
    return try {
      first.canonicalFile == second.canonicalFile
    } catch (_: Exception) {
      first.absoluteFile == second.absoluteFile
    }
  }

  private fun replaceSafely(source: File, destination: File, deleteSource: Boolean) {
    val parent = destination.parentFile ?: throw IllegalStateException("Destination folder was not found.")
    if (!parent.exists() && !parent.mkdirs()) {
      throw IllegalStateException("Destination folder could not be prepared.")
    }

    val token = UUID.randomUUID().toString()
    val temp = File(parent, "." + destination.name + ".sfm-tmp-" + token)
    val backup = File(parent, "." + destination.name + ".sfm-bak-" + token)

    try {
      copyRecursive(source, temp)

      if (destination.exists() && !destination.renameTo(backup)) {
        throw IllegalStateException("The existing destination could not be backed up safely.")
      }

      if (!temp.renameTo(destination)) {
        copyRecursive(temp, destination)
        deleteRecursive(temp)
      }

      if (deleteSource && source.exists()) {
        deleteRecursive(source)
      }

      if (backup.exists()) {
        deleteRecursive(backup)
      }
    } catch (error: Exception) {
      try {
        if (temp.exists()) deleteRecursive(temp)
      } catch (_: Exception) {}

      try {
        if (backup.exists()) {
          if (destination.exists()) deleteRecursive(destination)
          backup.renameTo(destination)
        }
      } catch (_: Exception) {}

      throw error
    }
  }

  private fun copyRecursive(source: File, destination: File) {
    if (source.isDirectory) {
      if (!destination.exists() && !destination.mkdirs()) {
        throw IllegalStateException("Folder could not be created: ${destination.absolutePath}")
      }
      val children = source.listFiles() ?: throw SecurityException("Folder could not be read: ${source.absolutePath}")
      children.forEach { child ->
        copyRecursive(child, File(destination, child.name))
      }
    } else {
      destination.parentFile?.let { parent ->
        if (!parent.exists() && !parent.mkdirs()) throw IllegalStateException("Destination folder could not be created.")
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
      val children = file.listFiles() ?: throw SecurityException("Folder could not be read: ${file.absolutePath}")
      children.forEach { deleteRecursive(it) }
    }
    if (!file.delete()) throw IllegalStateException("Could not delete: ${file.absolutePath}")
  }

  private fun guessMime(name: String): String {
    val extension = name.substringAfterLast('.', "").lowercase()
    return MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension) ?: "*/*"
  }
}
