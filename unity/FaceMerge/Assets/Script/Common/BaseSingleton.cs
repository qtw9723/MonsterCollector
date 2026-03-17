using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Singleton<T> where T : new()
{
    public static T Instance
    {
        get
        {
            if (_instance == null)
                _instance = new T();

            return _instance;
        }
    }

    private static T _instance;

    //public void Delete()
    //{
    //    _instance = null;
    //}
}
public abstract class MonoSingleton<T> : MonoBehaviour where T : MonoBehaviour
{
    private static T _instance = null;

    public static T Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = (T)FindObjectOfType(typeof(T));
                if (_instance == null)
                {

                    string goName = typeof(T).ToString();

                    GameObject go = GameObject.Find(goName);
                    if (go == null)
                        go = new GameObject(goName);
                    
                    _instance = go.AddComponent<T>();
                    DontDestroyOnLoad(_instance);
                }
            }
            return _instance;
        }
    }
    public virtual void Awake()
    {
        if (_instance == null)
        {
            _instance = GetComponent<T>();
            DontDestroyOnLoad(_instance);
        }
    }
    protected virtual void OnDestroy()
    {
        Debug.Log("OnDestroy : " + this.gameObject.name);
        _instance = null;
    }
    protected virtual void OnApplicationQuit()
    {
        Debug.Log("OnApplicationQuit : " + this.gameObject.name);
        _instance = null;
    }
    private Dictionary<string, IEnumerator> runningCoroutinesByEnumerator = new Dictionary<string, IEnumerator>();
    protected Coroutine StartCoroutine(IEnumerator coroutine, bool isForce = false)
    {
        if (!isForce)
            return base.StartCoroutine(Coroutine(coroutine));
        else
            return base.StartCoroutine(coroutine);
    }
    Stack<IEnumerator> stackContainedCor = new Stack<IEnumerator>();
    IEnumerator Coroutine(IEnumerator coroutine)
    {
        //Debug.Log(coroutine.ToString());
        yield return null;
        if (runningCoroutinesByEnumerator.ContainsKey(coroutine.ToString()))
        {
            //Debug.Log("Contain Coroutine" + coroutine.ToString());
            stackContainedCor.Push(coroutine);
            yield break;
        }

        runningCoroutinesByEnumerator.Add(coroutine.ToString(), coroutine);
        yield return base.StartCoroutine(coroutine);
        runningCoroutinesByEnumerator.Remove(coroutine.ToString());

        if (stackContainedCor.Count > 0)
        {
            IEnumerator cor = stackContainedCor.Pop();
            StartCoroutine(cor);
            //Debug.Log("Start Contained Coroutine. " + cor.ToString() + " leftCnt : " + stackContainedCor.Count);
        }

    }
    protected new void StopAllCoroutines()
    {
        stackContainedCor.Clear();
        if (runningCoroutinesByEnumerator.Count > 0)
        {
            foreach (var temp in runningCoroutinesByEnumerator.Values)
            {
                base.StopCoroutine(temp);
            }
        }
        runningCoroutinesByEnumerator.Clear();
    }
    protected new void StopCoroutine(IEnumerator coroutine)
    {
        base.StopCoroutine(coroutine);
        runningCoroutinesByEnumerator.Remove(coroutine.ToString());
    }
    public bool isRuningCoroutine()
    {
        return runningCoroutinesByEnumerator.Count > 0 ? true : false;
    }
    public bool isRuningCoroutine(IEnumerator coroutine)
    {
        return runningCoroutinesByEnumerator.ContainsKey(coroutine.ToString());
    }
}