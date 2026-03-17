using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ModelDataManager : MonoSingleton<ModelDataManager>
{
    public SummonRateModel summonRateModelContainer;
    public CardModel cardModelContainer;

    public void Init()
    {
        summonRateModelContainer = new SummonRateModel();
        cardModelContainer = new CardModel();
    }

    public void Dispose()
    {
        summonRateModelContainer.Dispose();
        cardModelContainer.Dispose();
    }
}
