using Microsoft.AspNetCore.SignalR;

namespace PresentationLayer.Hubs
{
    public class NotificationHub : Hub
    {
        public NotificationHub() { }
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
