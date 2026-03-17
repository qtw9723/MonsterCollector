using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
public static class Extentions
{
    public static void SetHeight(this RectTransform rt, float height)
    {
        rt.SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, height);
    }

    public static float GetHeight(this RectTransform rt)
    {
        return rt.rect.height;
    }

    public static void SetWidth(this RectTransform rt, float width)
    {
        rt.SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, width);
    }

    public static float GetWidth(this RectTransform rt)
    {
        return rt.rect.width;
    }

    public static void ClearAndSetAction(this Button btn , UnityAction call)
    {
        btn.onClick.RemoveAllListeners();
        btn.onClick.AddListener(call);
    }
}
