using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public abstract class CharacterBase : MonoBehaviour, IDamageable
{
    [SerializeField] protected float moveSpeed = 5f;
    [SerializeField] protected int maxHp = 100;
    [SerializeField] private CharacterHealthBar healthBarPrefab;
    [SerializeField] private Canvas canvas;

    protected Rigidbody2D rb;
    protected Vector2 inputDir;
    protected int currentHp;

    private CharacterHealthBar healthBar;

    public bool IsDead => currentHp <= 0;

    public virtual void Init()
    {
        rb = GetComponent<Rigidbody2D>();
        rb.gravityScale = 0f;
        rb.freezeRotation = true;
        currentHp = maxHp;

        if (healthBarPrefab != null && canvas != null)
        {
            healthBar = Instantiate(healthBarPrefab);
            healthBar.gameObject.SetActive(true);
            healthBar.Init(transform, canvas);
            healthBar.UpdateHP(currentHp, maxHp);
        }
    }

    public virtual void TakeDamage(int damage)
    {
        if (IsDead)
            return;

        currentHp -= damage;

        if (healthBar != null)
            healthBar.UpdateHP(currentHp, maxHp);

        if (IsDead)
            OnDead();
    }

    protected virtual void OnDead()
    {
        if (healthBar != null)
            healthBar.Dispose();
    }

    protected virtual void FixedUpdate()
    {

    }
}
