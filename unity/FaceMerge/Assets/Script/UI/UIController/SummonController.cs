using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Text;

public class SummonController : UIController
{
    private SummonRoot uiSummon;
    private UINumberPad uiNumberPad;

    private int curTryCount = 1;
    private NumberPadSummonRateModelData curSummonData;
    private StringBuilder sb = new StringBuilder();

    private int minNum = 1;
    private int maxNum = 100;

    private int curTargetNumber = 0;

    protected override void Init()
    {
        base.Init();

        uiSummon = ControlManager.Instance.ShowUIRoot<SummonRoot>();
        uiSummon.gameObject.SetActive(true);
        uiSummon.onGuessClick = OnGuessClick;
        uiSummon.Init();

        uiNumberPad = uiSummon.GetNumberPad();
        uiNumberPad.Init();

        uiNumberPad.onNumberPadClick = OnNumberPadClick;
        uiNumberPad.onClearClick = OnRemoveNumberClick;
        uiNumberPad.onBackKeyClick = OnBackNumberClick;

        sb.Clear();
        curTryCount = 1;

        uiSummon.SetTextBoxActive(false);
        RefreshTargetNumber();
        UpdateUI();
    }

    private void RefreshTargetNumber()
    {
        curTargetNumber = Random.Range(minNum, maxNum + 1);
    }

    protected override void UpdateUI()
    {
        curSummonData = ModelDataManager.Instance.numberPadSummonRateModelContainer.GetSummonData(curTryCount);
        uiSummon.UpdateData(curSummonData);

        uiSummon.SetMagicImageFillAmount((10f - (float)curTryCount) / 9f);
        UpdateNumberUI();
    }

    private void OnGuessClick()
    {
        var curNumber = GetCurNumber();

        if(curNumber > curTargetNumber)
        {
            uiSummon.SetTextBoxActive(true, "높아요!");
            ++curTryCount;
        }
        else if(curNumber < curTargetNumber)
        {
            uiSummon.SetTextBoxActive(true, "낮아요!");
            ++curTryCount;
        }
        else
        {
            AddCardData();
            RefreshTargetNumber();
            uiSummon.SetTextBoxActive(true, "정답이에요!");
            curTryCount = 1;
        }

        sb.Clear();
        UpdateUI();
    }

    private void AddCardData()
    {
        var addGrade = curSummonData.GetRandomGrade();
        var data = ModelDataManager.Instance.cardModelContainer.GetDataRandom(addGrade);
        CardManager.Instance.AddCardData(data);
    }

    private void OnNumberPadClick(int _num)
    {
        if (GetCurNumber() <= 0 && _num == 0)
            return;

        sb.Append(_num);

        if(GetCurNumber() > maxNum)
        {
            sb.Remove(sb.Length - 1, 1);
        }

        UpdateNumberUI();
    }

    private void UpdateNumberUI()
    {
        var curNumber = GetCurNumber();
        if(curNumber <= 0)
        {
            uiSummon.SetInputText("-");
            return;
        }

        uiSummon.SetInputText(sb.ToString());
    }

    private void OnRemoveNumberClick()
    {
        sb.Clear();
        UpdateNumberUI();
    }

    private void OnBackNumberClick()
    {
        if (sb.Length <= 0)
            return;

        sb.Remove(sb.Length - 1, 1);
        UpdateNumberUI();
    }

    private int GetCurNumber()
    {
        int.TryParse(sb.ToString(), out int result);
        return result;
    }

    public override void ExecuteBackKey()
    {
        ControlManager.Instance.ChangeScene<MainLobbyController>();
    }

    public void OnDisable()
    {
        if(uiSummon != null)
            uiSummon.gameObject.SetActive(false);
    }
}
