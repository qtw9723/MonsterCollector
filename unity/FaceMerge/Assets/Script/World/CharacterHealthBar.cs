using UnityEngine;
using UnityEngine.UI;

// Canvas (Screen Space - Camera 또는 Overlay) 위에 올라가는 HP바 UI
// 캐릭터의 월드 포지션을 스크린 좌표로 변환해 매 프레임 위치 갱신
[RequireComponent(typeof(RectTransform))]
public class CharacterHealthBar : MonoBehaviour
{
    [SerializeField] private Slider fill;
    [SerializeField] private Vector3 worldOffset = new(0f, 1.2f, 0f);
    [SerializeField] private Camera mainCamera;

    private RectTransform rect;
    private RectTransform canvasRect;
    private Transform target;
    private Camera cam;

    public void Init(Transform characterTransform, Canvas canvas)
    {
        target     = characterTransform;
        rect       = GetComponent<RectTransform>();
        canvasRect = canvas.GetComponent<RectTransform>();
        cam        = canvas.worldCamera != null ? canvas.worldCamera : Camera.main;

        transform.SetParent(canvas.transform, false);
    }

    public void UpdateHP(int current, int max)
    {
        if (max <= 0)
            return;

        fill.value = Mathf.Clamp01((float)current / max);
    }

    private void LateUpdate()
    {
        if (target == null)
            return;

        Vector3 screenPos = mainCamera.WorldToScreenPoint(target.position + worldOffset);

        RectTransformUtility.ScreenPointToLocalPointInRectangle(
            canvasRect, screenPos, cam, out Vector2 localPos);

        rect.localPosition = localPos;
    }

    public void Dispose()
    {
        Destroy(gameObject);
    }
}
