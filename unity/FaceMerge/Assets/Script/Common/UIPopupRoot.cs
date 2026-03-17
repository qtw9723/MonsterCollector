using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class UIBasePopupData
{

}

public abstract class UIBasePopup : MonoBehaviour
{
    private bool isExecute = false;
    public virtual void Setup(UIBasePopupData _popupData)
    {
        if(!isExecute)
        {
            ExecuteOnce();
            isExecute = true;
        }

        Init(_popupData);
    }

    protected virtual void ExecuteOnce()
    {

    }

    protected virtual void Init(UIBasePopupData _popupData)
    {

    }

    public void Close()
    {
        this.gameObject.SetActive(false);
    }

    public abstract void ExecuteBackKey();

}
