using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoSingleton<GameManager>
{
    public void Init()
    {
        ModelDataManager.Instance.Init();

        CardManager.Instance.LoadCardList();
    }

    public void Awake()
    {
        Init();
        ControlManager.Instance.ChangeScene<WorldController>();
        Debug.Log(Application.persistentDataPath);
    }

    public void Update()
    {
        if(Input.GetKeyDown(KeyCode.Escape))
        {
            if (ControlManager.Instance.ExecutePopupBackKeyAction())
                return;
            ControlManager.Instance.ExecuteCurControllerBackKey();
        }
    }
}
