using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;

public class UINumberPad : MonoBehaviour
{
    [SerializeField] private Button[] uiNumberPadBtns;
    [SerializeField] private Button uiBackBtn;
    [SerializeField] private Button uiClearBtn;

    public UnityAction<int> onNumberPadClick;
    public UnityAction onBackKeyClick;
    public UnityAction onClearClick;

    public void Init()
    {
        uiBackBtn.ClearAndSetAction(OnBackClick);
        uiClearBtn.ClearAndSetAction(OnClearClick);

        uiNumberPadBtns[0].ClearAndSetAction(() => OnNumberPadClick(0));
        uiNumberPadBtns[1].ClearAndSetAction(() => OnNumberPadClick(1));
        uiNumberPadBtns[2].ClearAndSetAction(() => OnNumberPadClick(2));
        uiNumberPadBtns[3].ClearAndSetAction(() => OnNumberPadClick(3));
        uiNumberPadBtns[4].ClearAndSetAction(() => OnNumberPadClick(4));
        uiNumberPadBtns[5].ClearAndSetAction(() => OnNumberPadClick(5));
        uiNumberPadBtns[6].ClearAndSetAction(() => OnNumberPadClick(6));
        uiNumberPadBtns[7].ClearAndSetAction(() => OnNumberPadClick(7));
        uiNumberPadBtns[8].ClearAndSetAction(() => OnNumberPadClick(8));
        uiNumberPadBtns[9].ClearAndSetAction(() => OnNumberPadClick(9));
    }

    private void OnNumberPadClick(int _num)
    {
        onNumberPadClick?.Invoke(_num);
    }

    private void OnBackClick()
    {
        onBackKeyClick?.Invoke();
    }

    private void OnClearClick()
    {
        onClearClick?.Invoke();
    }
}
