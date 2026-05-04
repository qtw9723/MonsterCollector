using System.Collections.Generic;
using UnityEngine;

// 무기 스프라이트에 부착
// 매 FixedUpdate마다 칼 끝점의 이동 궤적을 CircleCast로 스윕해 판정
public class WeaponHitSweep : MonoBehaviour
{
    [SerializeField] private Transform tipPoint;
    [SerializeField] private Transform basePoint;
    [SerializeField] private float sweepRadius = 0.08f;
    [SerializeField] private int damage = 10;
    [SerializeField] private LayerMask targetLayer;

    private readonly HashSet<Collider2D> alreadyHit = new();
    private readonly RaycastHit2D[] hitBuffer = new RaycastHit2D[10];

    private Vector2 prevTip;
    private Vector2 prevBase;
    private bool isActive;

    private void OnEnable()
    {
        prevTip  = tipPoint.position;
        prevBase = basePoint.position;
        alreadyHit.Clear();
        isActive = false;
    }

    // 애니메이션 이벤트 — 판정 시작
    public void BeginSwing()
    {
        prevTip  = tipPoint.position;
        prevBase = basePoint.position;
        alreadyHit.Clear();
        isActive = true;
    }

    // 애니메이션 이벤트 — 판정 종료
    public void EndSwing()
    {
        isActive = false;
    }

    private void FixedUpdate()
    {
        if (!isActive)
            return;

        SweepBlade(prevTip,  tipPoint.position);
        SweepBlade(prevBase, basePoint.position);

        prevTip  = tipPoint.position;
        prevBase = basePoint.position;
    }

    private void SweepBlade(Vector2 from, Vector2 to)
    {
        Vector2 dir = to - from;
        float dist  = dir.magnitude;

        if (dist < 0.001f)
            return;

        int count = Physics2D.CircleCastNonAlloc(from, sweepRadius, dir.normalized, hitBuffer, dist, targetLayer);

        for (int i = 0; i < count; i++)
        {
            Collider2D col = hitBuffer[i].collider;
            if (!alreadyHit.Add(col))
                continue;

            col.GetComponent<IDamageable>()?.TakeDamage(damage);
        }
    }

    private void OnDrawGizmos()
    {
        if (tipPoint == null || basePoint == null)
            return;

        Gizmos.color = isActive ? new Color(1f, 0f, 0f, 0.8f) : new Color(1f, 1f, 0f, 0.3f);
        Gizmos.DrawLine(basePoint.position, tipPoint.position);
        Gizmos.DrawWireSphere(tipPoint.position,  sweepRadius);
        Gizmos.DrawWireSphere(basePoint.position, sweepRadius);
    }
}
