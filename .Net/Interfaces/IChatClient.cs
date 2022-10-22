using Microsoft.AspNetCore.SignalR;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Hubs.Clients
{
    public interface IChatClient
    {
        Task SendMessage(Message message);
        Task UpdateMessage(MessageUpdateRequest message);
        Task DeleteMessage(OutgoingMessageIds message);
    }
}
