using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class UIController : MonoBehaviour
{
    public void Setup()
    {
        Init();
    }

    protected virtual void Init()
    {
        
    }

    protected virtual void UpdateUI()
    {

    }

    public abstract void ExecuteBackKey();
}
