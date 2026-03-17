using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

public static class SaveSystem
{
    // 🔐 AES Key & IV (32바이트/16바이트)
    // 직접 바꿔줘도 됨
    private static readonly string AES_KEY = "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6";
    private static readonly string AES_IV = "1A2B3C4D5E6F7G8H";

    private static string SavePath(string fileName)
        => Path.Combine(Application.persistentDataPath, fileName + ".sav");


    // ============================
    //  🔵 SAVE (with Encryption)
    // ============================
    public static void SaveEncrypted<T>(string fileName, T data)
    {
        var json = JsonUtility.ToJson(data, prettyPrint: false);
        var encrypted = AESEncrypt(json);

        File.WriteAllBytes(SavePath(fileName), encrypted);
    }


    // ============================
    //  🔵 LOAD (with Decryption)
    // ============================
    public static T LoadEncrypted<T>(string fileName)
    {
        var path = SavePath(fileName);
        if (!File.Exists(path))
            return default;

        var encrypted = File.ReadAllBytes(path);
        var json = AESDecrypt(encrypted);

        return JsonUtility.FromJson<T>(json);
    }


    // ============================
    //  🔐 AES Encrypt
    // ============================
    private static byte[] AESEncrypt(string plainText)
    {
        using var aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(AES_KEY);
        aes.IV = Encoding.UTF8.GetBytes(AES_IV);
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        var bytes = Encoding.UTF8.GetBytes(plainText);
        return encryptor.TransformFinalBlock(bytes, 0, bytes.Length);
    }


    // ============================
    //  🔐 AES Decrypt
    // ============================
    private static string AESDecrypt(byte[] cipherData)
    {
        using var aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(AES_KEY);
        aes.IV = Encoding.UTF8.GetBytes(AES_IV);
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        var decryptedBytes = decryptor.TransformFinalBlock(cipherData, 0, cipherData.Length);
        return Encoding.UTF8.GetString(decryptedBytes);
    }
}

