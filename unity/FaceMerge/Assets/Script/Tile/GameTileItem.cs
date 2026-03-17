using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameTileItem : MonoBehaviour
{
    [SerializeField] private Image uiImage;
    
    public void SetColor(Color color)
    {
        uiImage.color = color;
    }

    public Vector2 GetSzie()
    {
        var rt = gameObject.transform as RectTransform;
        return new Vector2(rt.rect.width, rt.rect.height);
    }
}
