using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace PresentationLayer.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public NotificationHub() { }
        public async Task SendMessage(string message)
        {
            var test = message;
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
