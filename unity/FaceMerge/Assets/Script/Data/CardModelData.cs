using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
public class CardModel
{
    private Dictionary<SummonGrade, List<CardModelData>> dictData = new();

    public List<CardModelData> GetDataList(SummonGrade grade)
    {
        if(!dictData.ContainsKey(grade))
        {
            var table = TableManager.Instance.GetTableData(TableName.CARD_DATA);
            var rows = table.GetRowByKey(eCol.B, (int)grade);
            var list = new List<CardModelData>();
            for (int i = 0; i < rows.Count; ++i)
            {
                var data = new CardModelData();
                data.SetData(rows[i]);
                list.Add(data);
            }

            dictData[grade] = list;
        }

        return dictData[grade];
    }

    public CardModelData GetData(int id)
    {
        for(var i = SummonGrade.N; i < SummonGrade.NONE; ++i)
        {
            var dataList = GetDataList(i);
            var data = dataList.FirstOrDefault(m => m.id == id);
            if (data != null)
                return data;
        }

        return null;
    }

    public CardModelData GetDataRandom(SummonGrade grade)
    {
        var dataList = GetDataList(grade);
        var idx = Random.Range(0, dataList.Count);
        return dataList[idx];
    }

    public void Dispose()
    {
        foreach (var iter in dictData.Values)
            iter.Clear();

        dictData.Clear();
    }
}


public class CardModelData : IBaseModel
{
    public int id { get; private set; }
    public SummonGrade grade { get; private set; }
    public string name { get; private set; }
    public int value1 { get; private set; }
    public int value2 { get; private set; }
    public int value3 { get; private set; }
    public string imageName { get; private set; }

    public void SetData(int row)
    {
        var table = TableManager.Instance.GetTableData(TableName.CARD_DATA);

        id = table.GetIntegerValue(row, eCol.A);
        grade = (SummonGrade)table.GetIntegerValue(row, eCol.B);
        name = table.GetStringValue(row, eCol.C);
        value1 = table.GetIntegerValue(row, eCol.D);
        value2 = table.GetIntegerValue(row, eCol.E);
        value3 = table.GetIntegerValue(row, eCol.F);
        imageName = table.GetStringValue(row, eCol.G);
    }

    public void Dispose()
    {

    }
}
