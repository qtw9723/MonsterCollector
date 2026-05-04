using UnityEngine;
using Pathfinding;

public class EnemyAI : CharacterBase
{
    [SerializeField] private Transform[] patrolTargets;
    [SerializeField] private Transform player;
    [SerializeField] private float detectRange = 5f;

    private IAstarAI ai;
    private int patrolIndex;

    private void Awake()
    {
        Init();
        ai = GetComponent<IAstarAI>();
    }

    private void Update()
    {
        if (IsPlayerInRange())
            Chase();
        else
            Patrol();
    }

    private bool IsPlayerInRange()
    {
        return Vector2.Distance(transform.position, player.position) <= detectRange;
    }

    private void Chase()
    {
        ai.destination = player.position;
    }

    private void Patrol()
    {
        if (patrolTargets.Length == 0)
            return;

        ai.destination = patrolTargets[patrolIndex].position;

        if (ai.reachedEndOfPath && !ai.pathPending)
        {
            patrolIndex = (patrolIndex + 1) % patrolTargets.Length;
            ai.SearchPath();
        }
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, detectRange);
    }

    protected override void OnDead()
    {
        base.OnDead();
        Destroy(gameObject);
    }

}
