using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TestPopup : UIBasePopup
{
    [SerializeField] private Button uiBtn;

    protected override void ExecuteOnce()
    {
        base.ExecuteOnce();
        uiBtn.onClick.AddListener(ExecuteBackKey);
    }

    public override void Setup(UIBasePopupData _popupData)
    {
        base.Setup(_popupData);
    }
    public override void ExecuteBackKey()
    {
        Close();
    }
}
