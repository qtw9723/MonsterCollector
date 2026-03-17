using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ModelDataManager : MonoSingleton<ModelDataManager>
{
    public NumberPadSummonRateModel numberPadSummonRateModelContainer;
    public CardModel cardModelContainer;

    public void Init()
    {
        numberPadSummonRateModelContainer = new NumberPadSummonRateModel();
        cardModelContainer = new CardModel();
    }

    public void Dispose()
    {
        numberPadSummonRateModelContainer.Dispose();
        cardModelContainer.Dispose();
    }
}
