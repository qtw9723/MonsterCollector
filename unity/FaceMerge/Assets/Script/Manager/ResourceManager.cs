using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cysharp.Text;

public class ResourceManager : MonoSingleton<ResourceManager>
{
    Dictionary<string, Object> dicLoadResources = new Dictionary<string, Object>();

    public T GetObject<T>(string name) where T : Object
    {
        T data = null;
        if (dicLoadResources.ContainsKey(name))
        {
            data = dicLoadResources[name] as T;
        }
        return data;
    }

    public T LoadObject<T>(string path, string filename) where T : Object
    {
        T data = GetObject<T>(filename);
        if (data == null)
        {
            string fullpath = ZString.Format("{0}/{1}", path, filename);
            data = Resources.Load<T>(fullpath);
            dicLoadResources[filename] = data;
        }
        return data;
    }

    public T LoadObject<T>(string path) where T : Object
    {
        T data = GetObject<T>(path);
        if (data == null)
        {
            data = Resources.Load<T>(path);
            dicLoadResources[path] = data;
        }
        return data;
    }
}
