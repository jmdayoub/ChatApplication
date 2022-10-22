using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class MessageService : IMessageService
    {
        IDataProvider _data = null;

        public MessageService(IDataProvider data)
        {
            _data = data;
        }

        #region CREATE
        public int AddMessage(MessageAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Messages_Insert]";

            _data.ExecuteNonQuery(procName
            , inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@SenderId", userId);
                col.AddWithValue("@RecipientId", model.RecipientId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        #endregion

        #region READ
        public Message GetById(int id)
        {
            Message message = null;
            string procName = "[dbo].[Messages_Select_ById]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int index = 0;

                message = MapSingleMessage(reader, ref index);
            });
            return message;
        }

        public List<Message> GetByRecipientId(int recipientId)
        {
            
            string procName = "[dbo].[Messages_Select_ByRece]";
            List<Message> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@RecipientId", recipientId);
            }, delegate (IDataReader reader, short set)
            {
                int index = 0;
                Message message = MapSingleMessage(reader, ref index);

                if (list == null)
                {
                    list = new List<Message>();
                }
                list.Add(message);
            });
            return list;
        }

        public List<User> GetUsersInConvos(int userId)
        {
            string procName = "[dbo].[Messages_Select_UsersInConvos]";
            List<User> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@userId", userId);
            }, delegate (IDataReader reader, short set)
            {
                int index = 0;
                User user = MapSingleUser(reader, ref index);

                if (list == null)
                {
                    list = new List<User>();
                }
                list.Add(user);
            });
            return list;
        }

        public List<Message> GetByConversation(int userId)
        {
            string procName = "[dbo].[Messages_Select_ByConversation]";
            List<Message> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@SenderId", userId);
            }, delegate (IDataReader reader, short set)
            {
                int index = 0;
                Message message = MapSingleMessage(reader, ref index);

                if (list == null)
                {
                    list = new List<Message>();
                }
                list.Add(message);
            });
            return list;
        }
        #endregion

        #region UPDATE
        public void Update(MessageUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Messages_Update]";

            _data.ExecuteNonQuery(procName
            , inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }
        #endregion

        #region DELETE
        public OutgoingMessageIds Delete(int id, int userId)
        {
            OutgoingMessageIds message = null;
            string procName = "[dbo].[Messages_Delete_ById]";

            _data.ExecuteCmd(procName
            , inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
                col.AddWithValue("@SenderId", userId);
            }, delegate (IDataReader reader, short set)
            {
                int index = 0;
                message = MapOutgoingIds(reader, ref index);
            });
            return message;
        }
        #endregion
        private static void AddCommonParams(MessageAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Message", model.Message);
            col.AddWithValue("@Subject", model.Subject);
        }
        private static Message MapSingleMessage(IDataReader reader, ref int index)
        {
            Message message = new Message();
            message.Sender = new Typer();
            message.Recipient = new Typer();

            message.Id = reader.GetSafeInt32(index++);
            message.MessageText = reader.GetSafeString(index++);
            message.Subject = reader.GetSafeString(index++);
            message.RecipientId = reader.GetSafeInt32(index++);
            message.SenderId = reader.GetSafeInt32(index++);
            message.Sender.FirstName = reader.GetSafeString(index++);
            message.Sender.LastName = reader.GetSafeString(index++);
            message.Sender.AvatarUrl = reader.GetSafeString(index++);
            message.Recipient.FirstName = reader.GetSafeString(index++);
            message.Recipient.LastName = reader.GetSafeString(index++);
            message.Recipient.AvatarUrl = reader.GetSafeString(index++);
            message.DateSent = reader.GetSafeDateTime(index++);
            message.DateRead = reader.GetSafeDateTime(index++);
            return message;
        }

        private static User MapSingleUser(IDataReader reader, ref int index)
        {
            User user = new User();
            user.Id = reader.GetSafeInt32(index++);
            user.Title = reader.GetSafeString(index++);
            user.FirstName = reader.GetSafeString(index++);
            user.LastName = reader.GetSafeString(index++);
            user.Mi = reader.GetSafeString(index++);
            user.AvatarUrl = reader.GetSafeString(index++);
            return user;
        }

        private static OutgoingMessageIds MapOutgoingIds(IDataReader reader, ref int index)
        {
            OutgoingMessageIds message = new OutgoingMessageIds();
            message.Id = reader.GetSafeInt32(index++);
            message.RecipientId = reader.GetSafeInt32(index++);
            return message;
        }
    }
}
