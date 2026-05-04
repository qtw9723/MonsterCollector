using UnityEngine;
using UnityEngine.EventSystems;

public class UIJoystick : MonoBehaviour, IPointerDownHandler, IDragHandler, IPointerUpHandler
{
    [SerializeField] private RectTransform background;
    [SerializeField] private RectTransform handle;

    public void OnPointerDown(PointerEventData eventData)
    {
        OnDrag(eventData);
    }

    public void OnDrag(PointerEventData eventData)
    {
        RectTransformUtility.ScreenPointToLocalPointInRectangle(
            background, eventData.position, eventData.pressEventCamera, out Vector2 localPoint);

        var radius = background.sizeDelta * 0.5f;
        var normalized = new Vector2(localPoint.x / radius.x, localPoint.y / radius.y);

        if (normalized.magnitude > 1f)
            normalized = normalized.normalized;

        handle.anchoredPosition = new Vector2(normalized.x * radius.x, normalized.y * radius.y);

        var dir = normalized.magnitude > 0.1f ? normalized.normalized : Vector2.zero;
        KeyInputManager.Instance.SetJoystickInput(dir);
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        handle.anchoredPosition = Vector2.zero;
        KeyInputManager.Instance.SetJoystickInput(Vector2.zero);
    }
}
