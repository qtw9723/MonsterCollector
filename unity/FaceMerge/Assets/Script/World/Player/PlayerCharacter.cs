using System.Collections;
using UnityEngine;

public class PlayerCharacter : CharacterBase
{
    [SerializeField] private AttackHitbox attackHitbox;
    [SerializeField] private float attackDuration = 0.2f;
    [SerializeField] private float attackCooldown = 0.5f;

    private bool isAttacking;
    private float lastAttackTime = -999f;
    private Vector2 facingDir = Vector2.right;

    private void Awake()
    {
        Init();
        KeyInputManager.Instance.onMoveInput += OnMoveInput;
        KeyInputManager.Instance.onAttackInput += TryAttack;
    }

    public void SetInputDirection(Vector2 dir)
    {
        inputDir = dir;
    }

    public void TryAttack()
    {
        if (isAttacking) return;
        if (Time.time - lastAttackTime < attackCooldown) return;

        StartCoroutine(AttackRoutine());
    }

    private IEnumerator AttackRoutine()
    {
        isAttacking = true;
        lastAttackTime = Time.time;

        attackHitbox.SetDirection(facingDir);
        attackHitbox.Activate();
        yield return new WaitForSeconds(attackDuration);
        attackHitbox.Deactivate();

        isAttacking = false;
    }

    private void OnMoveInput(Vector2 inputDir)
    {
        if (inputDir != Vector2.zero)
            facingDir = inputDir;

        rb.velocity = inputDir * moveSpeed;
    }

    // 애니메이션 이벤트에서 호출
    // int 파라미터: 키프레임 인덱스
    public void OnAttackKeyframe(int index)
    {
        attackHitbox.ApplyKeyframe(index);
    }

    protected override void FixedUpdate()
    {
        base.FixedUpdate();
    }
}
