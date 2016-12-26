using Angular2Application1.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;

namespace Angular2Application1.Hubs
{
    [HubName("coolmessages")]
    public class CoolMessagesHub : Hub
    {
        public void SendMessage(ChatMessage chatMessage)
        {
            Clients.All.SendMessage(chatMessage);
        }
    }
}
