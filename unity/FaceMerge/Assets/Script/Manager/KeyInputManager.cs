using System;
using UnityEngine;
using UnityEngine.Events;

public class KeyInputManager : MonoSingleton<KeyInputManager>
{
    public UnityAction<Vector2> onMoveInput;
    public UnityAction onAttackInput;

    [SerializeField] private float joystickDeadZone = 0.01f;
    [SerializeField] private float padDeadZone = 0.01f;

    private Vector2 mobileJoystickDir;
    
    private void Update()
    {
        var dir = Vector2.zero;

        // 모바일 조이스틱 우선
        if (mobileJoystickDir.sqrMagnitude > joystickDeadZone)
        {
            dir = mobileJoystickDir;
        }
        else
        {
            var padDir = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
            if (padDir.sqrMagnitude > padDeadZone)
                dir = padDir.normalized;
        }

        onMoveInput?.Invoke(dir);

        if (Input.GetKeyDown(KeyCode.Z) || Input.GetKeyDown(KeyCode.Space))
            onAttackInput?.Invoke();
    }

    // UI 공격 버튼에서 호출
    public void OnAttackButtonPressed()
    {
        onAttackInput?.Invoke();
    }

    // UIJoystick에서 호출
    public void SetJoystickInput(Vector2 dir)
    {
        mobileJoystickDir = dir;
    }
}
