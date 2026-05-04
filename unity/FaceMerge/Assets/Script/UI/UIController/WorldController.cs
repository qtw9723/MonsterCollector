public class WorldController : UIController
{
    protected override void Init()
    {
        base.Init();
        WorldManager.Instance.Init();
    }

    public void OnDisable()
    {
        WorldManager.Instance.Dispose();
    }

    public override void ExecuteBackKey()
    {
        ControlManager.Instance.ChangeScene<MainLobbyController>();
    }
}
