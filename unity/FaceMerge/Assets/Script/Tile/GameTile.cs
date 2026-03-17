using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameTile : MonoBehaviour
{
    [SerializeField] private GridLayoutGroup layOut;

    [SerializeField] private int row = 5;
    [SerializeField] private int column = 6;
    [SerializeField] private GameObject goTileRoot;

    [SerializeField] private List<GameTileItem> tileItemList = new List<GameTileItem>();

    public void Setup()
    {
        var size = tileItemList[0].GetSzie();
        var rtLayOut = layOut.transform as RectTransform;

        rtLayOut.SetWidth(size.x * column);
        rtLayOut.SetHeight(size.y * row);

        ResetAllTile();

        int count = row * column;
        for (int i = 0; i < count; ++i)
        {
            var item = GetTileItem(i);
            item.gameObject.SetActive(true);
            item.SetColor(i % 2 == 0 ? Color.white : Color.black);
        }
    }

    private GameTileItem GetTileItem(int _idx)
    {
        if(tileItemList.Count <= _idx)
        {
            var item = Instantiate(tileItemList[0], goTileRoot.transform);
            tileItemList.Add(item);
        }

        return tileItemList[_idx];
    }

    private void ResetAllTile()
    {
        foreach (var iter in tileItemList)
            iter.gameObject.SetActive(false);
    }
    
}
