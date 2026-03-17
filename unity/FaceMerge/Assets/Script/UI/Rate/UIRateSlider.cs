using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Cysharp.Text;
using TMPro;

public class UIRateSlider : MonoBehaviour
{
    [SerializeField] private Slider uiSlider;
    [SerializeField] private TextMeshProUGUI uiText;
    [SerializeField] private Image uiFillImage;

    private Color curColor;
    private string curText;
    private string curColorHex;

    public void Setup(string text , Color color)
    {
        curColor = color;
        curText = text;

        uiFillImage.color = color;
        curColorHex = CommonUtil.ColorToHexFast(color);
    }

    public void SetRate(float rate)
    {
        uiText.text = ZString.Format("<color={1}>{0}</color> : {2}%", curText, curColorHex, (rate * 100f).ToString("F2"));
        uiSlider.value = rate;
    }
}
