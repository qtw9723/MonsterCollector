using System.Collections.Generic;
using UnityEngine;

public class AttackHitbox : MonoBehaviour
{
    [System.Serializable]
    public struct HitboxKeyframe
    {
        public Vector2 localPosition;
        public Vector2 size;
    }

    [System.Serializable]
    public struct DirectionConfig
    {
        public HitboxKeyframe[] keyframes;
    }

    [SerializeField] private int damage = 10;
    [SerializeField] private LayerMask targetLayer;

    [Header("방향별 프레임 히트박스")]
    [SerializeField] private DirectionConfig right;
    [SerializeField] private DirectionConfig left;
    [SerializeField] private DirectionConfig up;
    [SerializeField] private DirectionConfig down;

    private BoxCollider2D col;
    private SpriteRenderer hitSprite;
    private readonly HashSet<Collider2D> alreadyHit = new();
    private bool isHit;
    private DirectionConfig activeConfig;

    private void Awake()
    {
        col = GetComponent<BoxCollider2D>();
        hitSprite = GetComponent<SpriteRenderer>();
        gameObject.SetActive(false);
    }

    private void OnEnable()
    {
        alreadyHit.Clear();
        isHit = false;
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (!IsInLayerMask(other.gameObject.layer))
            return;

        // 대상별로 판정 — 이미 맞은 대상만 스킵, 다른 몬스터는 정상 처리
        if (!alreadyHit.Add(other))
            return;

        other.GetComponentInParent<IDamageable>()?.TakeDamage(damage);
        isHit = true;
    }

    private bool IsInLayerMask(int layer)
    {
        return (targetLayer & (1 << layer)) != 0;
    }

    // 공격 시작 시 방향 설정 — 첫 번째 키프레임 즉시 적용
    public void SetDirection(Vector2 dir)
    {
        if (Mathf.Abs(dir.x) >= Mathf.Abs(dir.y))
            activeConfig = dir.x >= 0f ? right : left;
        else
            activeConfig = dir.y >= 0f ? up : down;

        if (hitSprite != null)
            hitSprite.flipX = hitSprite != null && dir.x < 0f;

        ApplyKeyframe(0);
    }

    // 애니메이션 이벤트에서 호출 — 파라미터: 키프레임 인덱스
    public void ApplyKeyframe(int index)
    {
        if (activeConfig.keyframes == null || activeConfig.keyframes.Length == 0)
            return;
        index = Mathf.Clamp(index, 0, activeConfig.keyframes.Length - 1);

        transform.localPosition = activeConfig.keyframes[index].localPosition;
        col.size                = activeConfig.keyframes[index].size;
    }

    public void Activate() => gameObject.SetActive(true);
    public void Deactivate() => gameObject.SetActive(false);

    private void OnDrawGizmos()
    {
        if (col == null)
            col = GetComponent<BoxCollider2D>();

        Color fillColor;
        Color wireColor;

        if (isHit)
        {
            fillColor = new Color(0f, 1f, 0f, 0.5f);
            wireColor = new Color(0f, 1f, 0f, 1f);
        }
        else if (gameObject.activeInHierarchy)
        {
            fillColor = new Color(1f, 0f, 0f, 0.5f);
            wireColor = new Color(1f, 0f, 0f, 1f);
        }
        else
        {
            fillColor = new Color(1f, 1f, 0f, 0.2f);
            wireColor = new Color(1f, 1f, 0f, 0.5f);
        }

        Vector3 center = transform.position;
        Gizmos.color = fillColor;
        Gizmos.DrawCube(center, col.size);
        Gizmos.color = wireColor;
        Gizmos.DrawWireCube(center, col.size);
    }
}
