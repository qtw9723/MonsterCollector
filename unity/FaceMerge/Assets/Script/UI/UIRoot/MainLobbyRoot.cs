using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;

public class MainLobbyRoot : UIBaseRoot
{
    [SerializeField] private Button uiButton;

    public UnityAction onMainBtnClick { get; set; }

    public override void ExcuteOnce()
    {
        base.ExcuteOnce();

        uiButton.ClearAndSetAction(OnMainButtonClick);
    }

    private void OnMainButtonClick()
    {
        onMainBtnClick?.Invoke();
    }

}
