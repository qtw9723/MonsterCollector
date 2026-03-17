#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using UnityEngine.Networking;
using System.Text;
using System.Threading.Tasks;

public class PacketTestEditor : EditorWindow
{
    private const string URL = "https://elqomxaemqiqalzhczfc.supabase.co/functions/v1/rank";

    private string bearerToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscW9teGFlbXFpcWFsemhjemZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjk2MDQsImV4cCI6MjA4NDYwNTYwNH0.0he5PJ_4W9pEUR1Vi8LbnhUwsOsb-8vh2wVXUh11R0k";

    private int userId = 12345;
    private string nickname = "상준이바보";
    private int score = 9999;
    private int level = 1;

    [MenuItem("Tools/Supabase/Rank API Tester")]
    public static void Open()
    {
        GetWindow<PacketTestEditor>("Rank API Tester");
    }

    private void OnGUI()
    {
        GUILayout.Label("Supabase Rank API Test", EditorStyles.boldLabel);

        GUILayout.Space(8);

        bearerToken = EditorGUILayout.TextField("Bearer Token", bearerToken);
        userId = EditorGUILayout.IntField("User ID", userId);
        nickname = EditorGUILayout.TextField("Nickname", nickname);
        score = EditorGUILayout.IntField("Score", score);
        level = EditorGUILayout.IntField("Level", level);

        GUILayout.Space(12);

        if (GUILayout.Button("🚀 Send Test Packet", GUILayout.Height(30)))
        {
            _ = SendRequestAsync();
        }
    }

    private async Task SendRequestAsync()
    {
        var body = new RankRequest
        {
            user_id = userId,
            nickname = nickname,
            score = score,
            level = level
        };

        string json = JsonUtility.ToJson(body);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        using var req = new UnityWebRequest(URL, "POST");
        req.uploadHandler = new UploadHandlerRaw(bodyRaw);
        req.downloadHandler = new DownloadHandlerBuffer();

        req.SetRequestHeader("Content-Type", "application/json");
        req.SetRequestHeader("Authorization", $"Bearer {bearerToken}");

        Debug.Log($"[Rank API] Request JSON:\n{json}");

        var op = req.SendWebRequest();

        while (!op.isDone)
            await Task.Yield();

        if (req.result == UnityWebRequest.Result.Success)
        {
            Debug.Log($"✅ SUCCESS ({req.responseCode})\n{req.downloadHandler.text}");
        }
        else
        {
            Debug.LogError($"❌ ERROR ({req.responseCode})\n{req.error}\n{req.downloadHandler.text}");
        }
    }


    [System.Serializable]
    private class RankRequest
    {
        public int user_id;
        public string nickname;
        public int score;
        public int level;
    }
}

#endif