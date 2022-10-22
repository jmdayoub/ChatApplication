//using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.SignalR;
//using Sabio.Models;
//using Sabio.Models.Domain.Messages;
//using Sabio.Models.Requests;
//using Sabio.Services;
//using Sabio.Services.Interfaces;
//using Sabio.Web.Api.Hubs.Clients;
//using System;
//using System.Collections.Concurrent;
//using System.Threading.Tasks;

//namespace Sabio.Web.Api.Hubs
//{
//    public class ChatHub : Hub
//    {
//        private readonly IMessageService _messageService = null;
//        private readonly IAuthenticationService<int> _authService = null;
//        private readonly IChatHubService _chatHub = null;
//        //private readonly ConcurrentDictionary<int, string> _connectedUsers = null;

//        public ChatHub(IMessageService messageService, IChatHubService chatHub, IAuthenticationService<int> authService)
//        {
//            _messageService = messageService;
//            _authService = authService;
//            _chatHub = chatHub;
//        }

//        

//        //public async Task OnDisconnectedAsync(Exception exception)
//        //{
//        //    int recipientId = _authService.GetCurrentUserId();
//        //    string exConnectionId = await _chatHub.DisconnectUser(recipientId);
//        //    await base.OnDisconnectedAsync(exception);
//        //}
//        public async Task SendMessage(MessageAddRequest message)
//        {
//            int senderId = _authService.GetCurrentUserId();
//            //await Clients.User(senderId.ToString()).ReceiveMessage(message); // 
//            _messageService.AddMessage(message, senderId);
//        }

//    }
//}

using System.Collections.Concurrent;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using Sabio.Web.Api.Hubs.Clients;

namespace Sabio.Web.Api.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
    }
}
