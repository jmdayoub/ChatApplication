using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Api.Hubs;
using Sabio.Web.Api.Hubs.Clients;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageApiController : BaseApiController
    {
        private IMessageService _messageService = null;
        private IAuthenticationService<int> _authService = null;
        private readonly IHubContext<ChatHub, IChatClient> _chatHub = null;

        public MessageApiController(IMessageService service, ILogger<MessageApiController> logger, IHubContext<ChatHub, IChatClient> chatHub, IAuthenticationService<int> authService) : base(logger)
        {
            _messageService = service;
            _authService = authService;
            _chatHub = chatHub;
        }

        #region CREATE
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(MessageAddRequest model)
        {            
            int code = 201;
            IUserAuthData user = _authService.GetCurrentUser();
            BaseResponse response = null;

            try
            {                
                int id = _messageService.AddMessage(model, user.Id);
                Message message = new Message(model);
                message.Id = id;
                _chatHub.Clients.Users(user.Id.ToString(), model.RecipientId.ToString()).SendMessage(message);

                if (id == 0)
                {
                    code = 400;
                    response = new ErrorResponse("user invalid");
                }
                else
                {
                    response = new ItemResponse<int> { Item = id };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }
        #endregion

        #region READ
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Message>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Message message = _messageService.GetById(id);

                if (message == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Message> { Item = message };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("recipient/{recipientId}")]
        public ActionResult<ItemsResponse<Message>> GetByReceId(int recipientId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Message> list = _messageService.GetByRecipientId(recipientId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<Message> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("conversation")]
        public ActionResult<ItemsResponse<Message>> GetByConversation()
        {
            
            int code = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                List<Message> list = _messageService.GetByConversation(userId);

                if(list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<Message> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("conversation/users/")]
        public ActionResult<ItemsResponse<User>> GetUsersInConvos()
        {
            int code = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                List<User> list = _messageService.GetUsersInConvos(userId);


                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<User> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        #endregion

        #region UPDATE
        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(MessageUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                _messageService.Update(model, userId);
                _chatHub.Clients.Users(userId.ToString(), model.RecipientId.ToString()).UpdateMessage(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic error: {ex.Message}");
            }
            return StatusCode(code, response);
        }
        #endregion

        #region DELETE
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            IUserAuthData user = _authService.GetCurrentUser();

            try
            {
                OutgoingMessageIds toDelete = _messageService.Delete(id, user.Id);
                if(toDelete == null)
                {
                    code = 404;
                    response = new ErrorResponse("Message not found");
                }    
                else
                {
                    _chatHub.Clients.Users(user.Id.ToString(), toDelete.RecipientId.ToString()).DeleteMessage(toDelete);
                    response = new SuccessResponse();
                }                
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        #endregion
    }
}
