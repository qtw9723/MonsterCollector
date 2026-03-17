using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using Cysharp.Text;

public class CardData
{
    private string guid; //서버 고유 아이디
    private CardModelData modelData;

    public void SetData(string _guid , CardModelData _modelData)
    {
        guid = _guid;
        modelData = _modelData;
    }

    public string GetGUID()
    {
        return guid;
    }

    public CardModelData GetCardModelData()
    {
        return modelData;
    }
}

[System.Serializable]
public class CardSaveDatas
{
    public List<CardSaveData> cardDatas;
}

[System.Serializable]
public class CardSaveData
{
    public string guid;
    public int cardId;
}

public class CardManager : Singleton<CardManager>
{
    private List<CardData> playerCards = new ();

    public void AddCardData(CardModelData modelata)
    {
        var data = new CardData();
        data.SetData(GetPrivateCardId(), modelata);
        playerCards.Add(data);

        Debug.Log(ZString.Format("Add Cards : {0} , {1}", modelata.grade, modelata.name));
        SevaCardList();
    }

    public string GetPrivateCardId()
    {
        return System.Guid.NewGuid().ToString("N");
    }

    public void ClearCardData()
    {
        playerCards.Clear();
    }

    #region Save

    public void SevaCardList()
    {
        var cardSaveList = new List<CardSaveData>();
        foreach (var iter in playerCards)
        {
            var saveData = new CardSaveData();
            saveData.guid = iter.GetGUID();
            saveData.cardId = iter.GetCardModelData().id;
            cardSaveList.Add(saveData);
        }

        CardSaveDatas data = new CardSaveDatas();
        data.cardDatas = cardSaveList;

        SaveSystem.SaveEncrypted("cards", data);
    }

    public void LoadCardList()
    {
        var saveData = SaveSystem.LoadEncrypted<CardSaveDatas>("cards");
        if (saveData == null)
            return;

        var container = ModelDataManager.Instance.cardModelContainer;

        playerCards.Clear();
        foreach (var iter in saveData.cardDatas)
        {
            var data = new CardData();
            var modelData = container.GetData(iter.cardId);
            data.SetData(iter.guid, modelData);
            playerCards.Add(data);
        }

        Debug.Log("Load Cards");
        foreach (var iter in playerCards)
            Debug.Log(ZString.Format("Add Cards : {0} , {1}", iter.GetCardModelData().grade, iter.GetCardModelData().name));
    }

    #endregion

}
