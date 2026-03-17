using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class UIBaseRoot : MonoBehaviour
{
    private bool isExcute = false;

    public void Setup()
    {
        if(!isExcute)
        {
            ExcuteOnce();
            isExcute = true;
        }

        Init();
    }

    public virtual void ExcuteOnce()
    {

    }

    public virtual void Init()
    {

    }
}
