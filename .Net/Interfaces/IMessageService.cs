using Sabio.Models.Domain.Messages;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IMessageService
    {
        int AddMessage(MessageAddRequest model, int currentUserId);
        Message GetById(int id);
        List<Message> GetByRecipientId(int recipientId);
        List<Message> GetByConversation(int currentUserId);
        void Update(MessageUpdateRequest model, int currentUserId);
        OutgoingMessageIds Delete(int id, int userId);
        List<User> GetUsersInConvos(int userId);
    }
}
