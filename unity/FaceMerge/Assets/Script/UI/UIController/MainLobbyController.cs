using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MainLobbyController : UIController
{
    private MainLobbyRoot uiMainLobby;
    protected override void Init()
    {
        base.Init();

        uiMainLobby = ControlManager.Instance.ShowUIRoot<MainLobbyRoot>();
        uiMainLobby.gameObject.SetActive(true);

        uiMainLobby.onMainBtnClick = OnMainBtnClick;
    }

    private void OnMainBtnClick()
    {
        ControlManager.Instance.ChangeScene<SummonController>();
    }

    public override void ExecuteBackKey()
    {
        
    }

    public void OnDisable()
    {
        if (uiMainLobby != null)
            uiMainLobby.gameObject.SetActive(false);
    }
}
