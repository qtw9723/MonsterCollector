using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

public class SummonRateModel
{
    Dictionary<int, SummonRateModelData> dictData;
    private int maxTryCount;

    public void SetData()
    {
        if (dictData != null)
            return;

        dictData = new Dictionary<int, SummonRateModelData>();
        var table = TableManager.Instance.GetTableData(TableName.SUMMON_RATE);
        var rowCount = table.GetRowCount();

        for(int i = 0; i < rowCount; ++i)
        {
            var modelData = new SummonRateModelData();
            modelData.SetData(i);
            dictData[modelData.tryCount] = modelData;
        }

        maxTryCount = dictData.Keys.Max();
    }

    public SummonRateModelData GetSummonData(int tryCount)
    {
        SetData();

        if (tryCount > maxTryCount)
            return dictData[maxTryCount];

        return dictData[tryCount];
    }

    public void Dispose()
    {
        if (dictData != null)
            dictData.Clear();
    }
}


public class SummonRateModelData : IBaseModel
{
    public int tryCount { get; private set; }
    public float ssrValue { get; private set; }
    public float srValue { get; private set; }
    public float rValue { get; private set; }
    public float nValue { get; private set; }

    public float[] rateArray { get; private set; }
    public float totalValue { get; private set; }

    public void SetData(int row)
    {
        var table = TableManager.Instance.GetTableData(TableName.SUMMON_RATE);

        tryCount = table.GetIntegerValue(row, eCol.A);
        ssrValue = table.GetIntegerValue(row, eCol.B);
        srValue = table.GetIntegerValue(row, eCol.C);
        rValue = table.GetIntegerValue(row, eCol.D);
        nValue = table.GetIntegerValue(row, eCol.E);

        totalValue = ssrValue + srValue + rValue + nValue;

        rateArray = new float[] { nValue / totalValue, rValue / totalValue, srValue / totalValue, ssrValue / totalValue };
    }

    public float GetRate(SummonGrade eGrade)
    {
        var grade = (int)eGrade - 1;
        if (rateArray.Length <= grade)
            return 0f;

        return rateArray[grade];
    }

    public SummonGrade GetRandomGrade()
    {
        return (SummonGrade)(CommonUtil.GetRandomIndexByProbability(rateArray) + 1);
    }

    public void Dispose()
    {

    }
}
