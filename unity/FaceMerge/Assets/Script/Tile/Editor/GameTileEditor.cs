using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(GameTile))]
[CanEditMultipleObjects]
public class GameTileEditor : Editor
{
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();

        EditorGUILayout.Space();
        using (new EditorGUILayout.HorizontalScope())
        {
            if (GUILayout.Button("Setup"))
            {
                var t = (GameTile)target;
                t.Setup();
            }
        }
    }
}
