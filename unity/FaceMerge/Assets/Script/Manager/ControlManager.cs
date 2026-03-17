using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cysharp.Text;

public class ControlManager : MonoSingleton<ControlManager>
{
    [SerializeField] private GameObject goPopupRoot;
    [SerializeField] private GameObject goUIRoot;
    [SerializeField] private GameObject goControllerRoot;

    private UIController curController;

    #region Popup

    public T ShowPopup<T>(UIBasePopupData popupData = null) where T : UIBasePopup
    {
        var popup = GetPopup<T>();

        popup.transform.SetAsLastSibling();
        popup.gameObject.SetActive(true);
        popup.Setup(popupData);

        return popup;
    }

    private T GetPopup<T>() where T : UIBasePopup
    {
        var popupTransform = FindPopup<T>();
        if (popupTransform != null)
        {
            return popupTransform.GetComponent<T>();
        }

        return CreatePopup<T>();
    }

    private Transform FindPopup<T>(bool _isIncludeEnactive = false) where T : UIBasePopup
    {
        var popupName = typeof(T).ToString();
        var count = goPopupRoot.transform.childCount;
        for(int i = 0; i < count; ++i)
        {
            var child = goPopupRoot.transform.GetChild(i);

            if (child.name != popupName)
                continue;

            if (_isIncludeEnactive || !child.gameObject.activeSelf)
                return child;
        }

        return null;
    }

    private T CreatePopup<T>() where T : UIBasePopup
    {
        var popupName = typeof(T).ToString();

        var origin = ResourceManager.Instance.LoadObject<T>(ZString.Concat(Constant.popupPath , popupName));
        if (origin == null)
            return null;

        var popup = Instantiate(origin, goPopupRoot.transform);
        return popup;
    }

    public bool ExecutePopupBackKeyAction()
    {
        var count = goPopupRoot.transform.childCount;
        for(int i = count - 1; i >= 0; --i)
        {
            var child = goPopupRoot.transform.GetChild(i);
            if(child.gameObject.activeSelf)
            {
                var popup = child.GetComponent<UIBasePopup>();
                popup.ExecuteBackKey();
                return true;
            }
        }
        return false;
    }

    #endregion

    #region UIRoot

    public T ShowUIRoot<T>() where T : UIBaseRoot
    {
        var root = GetUIRoot<T>();
        root.Setup();
        return root;
    }

    public T GetUIRoot<T>() where T : UIBaseRoot
    {
        var uiTransform = FindUIRoot<T>();
        if (uiTransform != null)
        {
            return uiTransform.GetComponent<T>();
        }

        return CreateRoot<T>();
    }

    private Transform FindUIRoot<T>() where T : UIBaseRoot
    {
        var uiName = typeof(T).ToString();
        var count = goUIRoot.transform.childCount;
        for (int i = 0; i < count; ++i)
        {
            var child = goUIRoot.transform.GetChild(i);

            if (child.name != uiName)
                continue;

            return child;
        }

        return null;
    }

    private T CreateRoot<T>() where T : UIBaseRoot
    {
        var uiName = typeof(T).ToString();

        var origin = ResourceManager.Instance.LoadObject<T>(ZString.Concat(Constant.uiRootPath, uiName));
        if (origin == null)
            return null;

        var ui = Instantiate(origin, goUIRoot.transform);
        ui.name = uiName;

        return ui;
    }

    public void ClearAllUIRoot()
    {
        
    }

    #endregion

    private T GetUIController<T>() where T : UIController
    {
        var uiTransform = FindUIController<T>();
        if (uiTransform != null)
        {
            return uiTransform.GetComponent<T>();
        }

        return CreateUIController<T>();
    }

    private Transform FindUIController<T>() where T : UIController
    {
        var controllerName = typeof(T).ToString();
        var count = goControllerRoot.transform.childCount;
        for (int i = 0; i < count; ++i)
        {
            var child = goControllerRoot.transform.GetChild(i);

            if (child.name != controllerName)
                continue;

            return child;
        }

        return null;
    }

    private T CreateUIController<T>() where T : UIController
    {
        var name = typeof(T).ToString();

        var obj = new GameObject(name);
        var component = obj.AddComponent<T>();
        obj.transform.SetParent(goControllerRoot.transform);
        obj.transform.SetAsLastSibling();
        obj.name = name;

        return component;
    }

    public T ChangeScene<T>() where T : UIController
    {
        if (curController != null)
            curController.gameObject.SetActive(false);

        curController = GetUIController<T>();
        curController.gameObject.SetActive(true);
        curController.Setup();

        return (T)curController;
    }

    public void ExecuteCurControllerBackKey()
    {
        if (curController != null)
            curController.ExecuteBackKey();
    }
}
