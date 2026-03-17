using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cysharp.Text;
using System.Xml.Linq;

public enum eCol
{
    A, B, C, D, E, F, G, H, I, J, K, L, M,
    N, O, P, Q, R, S, T, U, V, W, X, Y, Z
}

public enum TableName
{
    SUMMON_RATE,
    CARD_DATA,
}

public class TableData
{
    private List<RowData> rowData = new List<RowData>();

    //정수형으로 값 불러오기
    public int GetIntegerValue(int row , eCol col)
    {
        if (row >= rowData.Count)
            return -1;

        return rowData[row].GetIntergerValue(col);
    }

    //실수형으로 값 불러오기
    public float GetFloatValue(int row, eCol col)
    {
        if (row >= rowData.Count)
            return -1f;

        return rowData[row].GetFloatValue(col);
    }

    //스트링으로 값 불러오기
    public string GetStringValue(int row, eCol col)
    {
        if (row >= rowData.Count)
            return string.Empty;

        return rowData[row].GetStringValue(col);
    }

    public void AddData(RowData data)
    {
        rowData.Add(data);
    }

    public override string ToString()
    {
        var str = string.Empty;
        foreach (var iter in rowData)
        {
            str = ZString.Concat(str, iter.ToString() , "\n");
        }

        return str;
    }

    public int GetRowCount()
    {
        return rowData.Count;
    }

    public List<int> GetRowByKey(eCol col , int value)
    {
        var list = new List<int>();
        var count = GetRowCount();
        for(int i = 0; i < count; ++i)
        {
            if(rowData[i].GetIntergerValue(col) == value)
                list.Add(i);
        }

        return list;
    }
}

public class RowData
{
    private Dictionary<eCol, string> values = new Dictionary<eCol, string>();

    private Dictionary<eCol, int> integerValues = new Dictionary<eCol, int>();
    private Dictionary<eCol, float> floatValues = new Dictionary<eCol, float>();

    public int GetIntergerValue(eCol col)
    {
        if (integerValues.ContainsKey(col))
            return integerValues[col];

        if (!values.ContainsKey(col))
            return -1;

        int.TryParse(values[col], out int result);
        integerValues[col] = result;
        return result;
    }

    public float GetFloatValue(eCol col)
    {
        if (floatValues.ContainsKey(col))
            return integerValues[col];

        if (!values.ContainsKey(col))
            return -1;

        float.TryParse(values[col], out float result);
        floatValues[col] = result;
        return result;
    }

    public string GetStringValue(eCol col)
    {
        if (!values.ContainsKey(col))
            return string.Empty;

        return values[col];
    }

    public string Get(eCol key, string defaultValue = "")
    {
        if (values.TryGetValue(key, out string v))
            return v;
        return defaultValue;
    }

    public void SetValue(eCol key, string value)
    {
        values[key] = value;
    }

    public override string ToString()
    {
        string result = "";
        foreach (var kvp in values)
        {
            result += $"{kvp.Key}={kvp.Value}, ";
        }
        return result.TrimEnd(' ', ',');
    }
}


public class TableManager : Singleton<TableManager>
{
    private Dictionary<TableName, TableData> tables = new Dictionary<TableName, TableData>();

    public TableData GetTableData(TableName tableName)
    {
        if (!tables.ContainsKey(tableName))
        {
            var path = ZString.Format("{0}{1}", Constant.tablePath, tableName);
            var xmlAsset = Resources.Load<TextAsset>(path);
            if (xmlAsset == null)
            {
                Debug.LogError(ZString.Concat("XML 파일을 찾을 수 없습니다:", path));
                return null;
            }

            var doc = XDocument.Parse(xmlAsset.text);
            tables[tableName] = new TableData();

            foreach (XElement element in doc.Root.Elements("Row"))
            {
                var rowData = new RowData();

                foreach (XElement child in element.Elements())
                {
                    string tagName = child.Name.LocalName; // "A", "B", "C", ...

                    // 태그 이름을 enum Col 로 변환 가능하면 처리
                    if (System.Enum.TryParse(tagName, out eCol colKey))
                    {
                        // string 그대로 저장
                        rowData.SetValue(colKey, child.Value);
                    }
                    else
                    {
                        Debug.LogWarning($"알 수 없는 태그: {tagName}");
                    }
                }

                tables[tableName].AddData(rowData);
            }
            Debug.Log(tables[tableName].ToString());
        }

        return tables[tableName];
    }

}
