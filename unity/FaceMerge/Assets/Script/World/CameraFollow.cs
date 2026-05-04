using UnityEngine;
using UnityEngine.Tilemaps;

public class CameraFollow : MonoBehaviour
{
    [SerializeField] private Transform target;
    [SerializeField] private float smoothSpeed = 5f;
    [SerializeField] private Tilemap tilemap;

    private Camera cam;
    private Bounds mapBounds;

    private void Awake()
    {
        cam = GetComponent<Camera>();
    }

    private void Start()
    {
        if (tilemap != null)
            RefreshMapBounds();
    }

    public void RefreshMapBounds()
    {
        tilemap.CompressBounds();
        Bounds local = tilemap.localBounds;
        Vector3 worldCenter = tilemap.transform.TransformPoint(local.center);
        mapBounds = new Bounds(worldCenter, local.size);
    }

    private void LateUpdate()
    {
        if (target == null) return;

        Vector3 desired = new Vector3(target.position.x, target.position.y, transform.position.z);
        Vector3 smoothed = Vector3.Lerp(transform.position, desired, smoothSpeed * Time.deltaTime);

        if (tilemap != null)
            smoothed = Clamp(smoothed);

        transform.position = smoothed;
    }

    private Vector3 Clamp(Vector3 pos)
    {
        float halfH = cam.orthographicSize;
        float halfW = halfH * cam.aspect;

        float x = Mathf.Clamp(pos.x, mapBounds.min.x + halfW, mapBounds.max.x - halfW);
        float y = Mathf.Clamp(pos.y, mapBounds.min.y + halfH, mapBounds.max.y - halfH);

        return new Vector3(x, y, pos.z);
    }
}
