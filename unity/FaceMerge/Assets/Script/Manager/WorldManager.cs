using UnityEngine;

public class WorldManager : MonoSingleton<WorldManager>
{
    [SerializeField] private PlayerCharacter player;

    public void Init()
    {
        player.Init();
        KeyInputManager.Instance.onMoveInput += player.SetInputDirection;
        KeyInputManager.Instance.onAttackInput += player.TryAttack;
    }

    public void Dispose()
    {
        KeyInputManager.Instance.onMoveInput -= player.SetInputDirection;
        KeyInputManager.Instance.onAttackInput -= player.TryAttack;
    }
}
