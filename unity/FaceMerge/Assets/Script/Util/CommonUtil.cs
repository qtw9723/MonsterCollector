using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cysharp.Text;
public static class CommonUtil 
{
    public static int GetRandomIndexByProbability(float[] probs)
    {
        // 전체 합 구하기
        float sum = 0f;
        for (int i = 0; i < probs.Length; i++)
            sum += probs[i];

        // 랜덤 값 생성 (0 ~ sum)
        float r = UnityEngine.Random.Range(0f, sum);

        float cumulative = 0f;

        for (int i = 0; i < probs.Length; i++)
        {
            cumulative += probs[i];
            if (r <= cumulative)
                return i;
        }

        return probs.Length - 1;
    }

    public static string ColorToHexFast(Color color)
    {
        Color32 c = color;
        var sb = ZString.CreateStringBuilder();
        sb.Append('#');

        AppendByteHex(ref sb, c.r);
        AppendByteHex(ref sb, c.g);
        AppendByteHex(ref sb, c.b);

        return sb.ToString();
    }

    private static void AppendByteHex(ref Utf16ValueStringBuilder sb, byte value)
    {
        const string hex = "0123456789ABCDEF";
        sb.Append(hex[(value >> 4) & 0xF]);
        sb.Append(hex[value & 0xF]);
    }
}
