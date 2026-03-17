using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
using TMPro;

public class SummonRoot : UIBaseRoot
{
    [SerializeField] private List<UIRateSlider> uiSliders;
    [SerializeField] private GameObject goSliderGroup;
    [SerializeField] private TextMeshProUGUI uiText;
    [SerializeField] private UINumberPad uiNumberPad;
    [SerializeField] private GameObject goTextBox;
    [SerializeField] private Text uiTextBoxText;
    [SerializeField] private Image uiFillArea;

    [SerializeField] private Color ssrColor;
    [SerializeField] private Color srColor;
    [SerializeField] private Color rColor;
    [SerializeField] private Color nColor;

    [SerializeField] private Button uiGuessBtn;

    public UnityAction onGuessClick { get; set; }

    private NumberPadSummonRateModelData curData;

    public override void ExcuteOnce()
    {
        base.ExcuteOnce();

        uiGuessBtn.ClearAndSetAction(OnGuessClick);
    }

    public override void Init()
    {
        base.Init();

        uiSliders[(int)SummonGrade.SSR - 1].Setup("Legendary", ssrColor);
        uiSliders[(int)SummonGrade.SR - 1].Setup("Epic", srColor);
        uiSliders[(int)SummonGrade.R - 1].Setup("Rare", rColor);
        uiSliders[(int)SummonGrade.N - 1].Setup("Normal", nColor);
    }

    public void UpdateData(NumberPadSummonRateModelData data)
    {
        curData = data;
        UpdateUI();
    }

    public void UpdateUI()
    {
        for(var i = SummonGrade.N; i < SummonGrade.NONE; ++i)
        {
            uiSliders[(int)i - 1].SetRate(curData.GetRate(i));
        }
    }
    public void SetInputText(string text)
    {
        uiText.text = text;
    }

    public void SetTextBoxActive(bool _active , string _text = "")
    {
        goTextBox.SetActive(false);
        goTextBox.SetActive(_active);
        uiTextBoxText.text = _text;
    }

    public void SetMagicImageFillAmount(float _value)
    {
        uiFillArea.fillAmount = _value;
    }

    private void OnGuessClick()
    {
        onGuessClick?.Invoke();
    }

    public UINumberPad GetNumberPad() => uiNumberPad;

}
