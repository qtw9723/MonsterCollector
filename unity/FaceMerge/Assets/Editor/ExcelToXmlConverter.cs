// ExcelToXmlConverter - Unity Editor Tool
// Place this file into Assets/Editor/ (create Editor folder if needed)
// Requires NPOI (for .xlsx). Add NPOI .dlls to Assets/Plugins or install via package manager.
// NPOI packages required: NPOI, NPOI.OOXML, NPOI.OpenXml4Net

using System;
using System.IO;
using System.Text;
using System.Xml;
using System.Linq;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

#if NPOI
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
#endif

public class ExcelToXmlConverter : EditorWindow
{
    private string excelPath = "";
    private string outputPath = "";
    private int sheetIndex = 0;
    private int headerRowsToIgnore = 1; // user said first row is header and should be ignored
    private bool trimEmptyRows = true;
    private Vector2 scroll;

    [MenuItem("Tools/Excel → XML Converter (A~Z)")]
    public static void ShowWindow()
    {
        var w = GetWindow<ExcelToXmlConverter>("Excel → XML (A~Z)");
        w.minSize = new Vector2(500, 260);
    }

    private void OnGUI()
    {
        EditorGUILayout.HelpBox("Converts an .xlsx (Excel) into an XML where columns A..Z map to tags <A>.. <Z>.\nFirst row(s) will be ignored (header).", MessageType.Info);

        GUILayout.Space(6);

        EditorGUILayout.LabelField("Excel file (.xlsx)", EditorStyles.boldLabel);
        EditorGUILayout.BeginHorizontal();
        excelPath = EditorGUILayout.TextField(excelPath);
        if (GUILayout.Button("Browse", GUILayout.Width(80)))
        {
            string p = EditorUtility.OpenFilePanel("Select Excel (.xlsx)", Application.dataPath, "xlsx");
            if (!string.IsNullOrEmpty(p)) excelPath = p;
        }
        EditorGUILayout.EndHorizontal();

        GUILayout.Space(6);

        EditorGUILayout.LabelField("Output XML file", EditorStyles.boldLabel);
        EditorGUILayout.BeginHorizontal();
        outputPath = EditorGUILayout.TextField(outputPath);
        if (GUILayout.Button("Browse", GUILayout.Width(80)))
        {
            string p = EditorUtility.SaveFilePanel("Save XML as", Application.dataPath, "map", "xml");
            if (!string.IsNullOrEmpty(p)) outputPath = p;
        }
        EditorGUILayout.EndHorizontal();

        GUILayout.Space(6);

        EditorGUILayout.LabelField("Options", EditorStyles.boldLabel);
        headerRowsToIgnore = EditorGUILayout.IntField(new GUIContent("Header rows to ignore", "Number of top rows to skip (e.g. 1 to ignore first header row)"), headerRowsToIgnore);
        trimEmptyRows = EditorGUILayout.Toggle(new GUIContent("Trim trailing empty rows", "If true, rows where all A..Z are empty will be skipped"), trimEmptyRows);

        GUILayout.Space(8);

        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("Convert", GUILayout.Height(36)))
        {
            if (string.IsNullOrEmpty(excelPath) || !File.Exists(excelPath))
            {
                EditorUtility.DisplayDialog("Error", "Please select an existing .xlsx file.", "OK");
            }
            else if (string.IsNullOrEmpty(outputPath))
            {
                EditorUtility.DisplayDialog("Error", "Please select an output XML path.", "OK");
            }
            else
            {
                ConvertExcelToXml(excelPath, outputPath, headerRowsToIgnore, trimEmptyRows);
            }
        }

        if (GUILayout.Button("Open Output Folder", GUILayout.Height(36)))
        {
            if (!string.IsNullOrEmpty(outputPath))
            {
                EditorUtility.RevealInFinder(Path.GetDirectoryName(outputPath));
            }
            else
            {
                EditorUtility.RevealInFinder(Application.dataPath);
            }
        }
        EditorGUILayout.EndHorizontal();

        GUILayout.FlexibleSpace();

        EditorGUILayout.LabelField("Notes:");
        EditorGUILayout.LabelField(" - This tool maps Excel columns A..Z to XML tags <A>.. <Z> for each data row.");
        EditorGUILayout.LabelField(" - The top 'headerRowsToIgnore' rows will be skipped (e.g. 1 to ignore the first row).");
        EditorGUILayout.LabelField(" - Install NPOI (or define NPOI symbol and add DLLs) to enable .xlsx reading.");
    }

    private void ConvertExcelToXml(string excelFile, string xmlFile, int skipHeaderRows, bool trimEmpty)
    {
#if !NPOI
        EditorUtility.DisplayDialog("Missing Dependency", "NPOI is not defined. Please add NPOI DLLs to Assets/Plugins and define the scripting symbol 'NPOI' in Player Settings > Scripting Define Symbols, or enable the assembly. See comments in the script.", "OK");
        return;
#else
        try
        {
            using (var stream = File.Open(excelFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                IWorkbook workbook = new XSSFWorkbook(stream);
                if (workbook.NumberOfSheets == 0)
                {
                    EditorUtility.DisplayDialog("Error","No sheets found in workbook.","OK");
                    return;
                }

                // Use the first sheet by default
                ISheet sheet = workbook.GetSheetAt(0);

                int firstRow = sheet.FirstRowNum + skipHeaderRows;
                int lastRow = sheet.LastRowNum;

                var rows = new List<List<string>>();

                for (int r = firstRow; r <= lastRow; r++)
                {
                    IRow row = sheet.GetRow(r);
                    if (row == null)
                    {
                        // treat as empty
                        rows.Add(EmptyRowAtoZ());
                        continue;
                    }

                    var cells = new List<string>();
                    for (int c = 0; c < 26; c++) // A..Z
                    {
                        ICell cell = row.GetCell(c, MissingCellPolicy.RETURN_NULL_AND_BLANK);
                        if (cell == null)
                        {
                            continue;
                            //cells.Add(string.Empty);
                        }
                        else
                        {
                            // Read as string - preserve numbers as their text representation
                            string val = GetCellString(cell);
                            cells.Add(val);
                        }
                    }
                    rows.Add(cells);
                }

                if (trimEmpty)
                {
                    // remove trailing rows where all cells empty
                    for (int i = rows.Count - 1; i >= 0; i--)
                    {
                        if (rows[i].All(s => string.IsNullOrEmpty(s))) rows.RemoveAt(i);
                        else break;
                    }
                }

                // build XML
                var settings = new XmlWriterSettings { Indent = true, Encoding = Encoding.UTF8 };
                using (var xw = XmlWriter.Create(xmlFile, settings))
                {
                    xw.WriteStartDocument();
                    xw.WriteStartElement("Element");

                    for (int i = 0; i < rows.Count; i++)
                    {
                        var r = rows[i];
                        xw.WriteStartElement("Row");

                        // Write A..Z tags. If you want to map A to Count for readability add comments somewhere else.
                        for (int col = 0; col < r.Count; col++)
                        {
                            char tag = (char)('A' + col);
                            xw.WriteStartElement(tag.ToString());
                            // write value (empty tag if value empty)
                            xw.WriteString(r[col]);
                            xw.WriteEndElement();
                        }

                        xw.WriteEndElement(); // Try
                    }

                    xw.WriteEndElement(); // ProbTable
                    xw.WriteEndDocument();
                }

                EditorUtility.DisplayDialog("Success", $"Converted to XML:\n{xmlFile}", "OK");
                AssetDatabase.Refresh();
            }
        }
        catch (Exception ex)
        {
            Debug.LogException(ex);
            EditorUtility.DisplayDialog("Error","An error occurred during conversion. See console for details.","OK");
        }
#endif
    }

#if NPOI
    private static string GetCellString(ICell cell)
    {
        switch (cell.CellType)
        {
            case CellType.String:
                return cell.StringCellValue;
            case CellType.Numeric:
                if (DateUtil.IsCellDateFormatted(cell))
                {
                    return cell.DateCellValue.ToString();
                }
                else
                {
                    // preserve formatting if available
                    var fmt = cell.CellStyle?.GetDataFormatString();
                    return cell.NumericCellValue.ToString();
                }
            case CellType.Boolean:
                return cell.BooleanCellValue ? "1" : "0";
            case CellType.Formula:
                try
                {
                    return cell.StringCellValue;
                }
                catch
                {
                    return cell.ToString();
                }
            case CellType.Blank:
            case CellType.Unknown:
            default:
                return string.Empty;
        }
    }
#endif

    private static List<string> EmptyRowAtoZ()
    {
        var list = new List<string>();
        for (int i = 0; i < 26; i++) list.Add(string.Empty);
        return list;
    }
}
