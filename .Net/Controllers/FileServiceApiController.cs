using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.File;
using Sabio.Models.Requests.File;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Core.Configs;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileServiceApiController : BaseApiController
    {
        private AWSStorageConfig _awsStorageConfig;
        private IAuthenticationService<int> _authService = null;
        private IFileService _service = null;
        private ILookUpService _lookup = null;

        public FileServiceApiController(ILookUpService lookup, IFileService service, IOptions<AWSStorageConfig> awsStorageConfig, IAuthenticationService<int> authService, ILogger<FileServiceApiController> logger) : base(logger)
        {
            _authService = authService;
            _awsStorageConfig = awsStorageConfig.Value;
            _service = service;
            _lookup = lookup;
        }

        [HttpPost("{tableName}")]
        public ActionResult<ItemsResponse<LookUp>> GetFileType(string tableName)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<LookUp> list = _lookup.GetLookUp(tableName);

                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemsResponse<LookUp> { Items = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<FileModel>>> GetAll(int pageSize, int pageIndex)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<FileModel> pagedFile = _service.GetAll(pageSize, pageIndex);

                if (pagedFile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<FileModel>> { Item = pagedFile };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<FileModel>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                FileModel aFile = _service.GetById(id);

                if (aFile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<FileModel> { Item = aFile };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("filetype")]
        public ActionResult<ItemResponse<Paged<FileModel>>> GetByFileTypeId(int id, int pageSize, int pageIndex)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<FileModel> pagedFile = _service.GetByFileTypeId(id, pageSize, pageIndex);

                if (pagedFile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<FileModel>> { Item = pagedFile };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("getByDeleteQuery")]
        public ActionResult<ItemResponse<Paged<FileModel>>> GetByDeleteQuery(int pageSize, int pageIndex, bool deleteQuery)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<FileModel> pagedFile = _service.GetByDeleteQuery(pageSize, pageIndex, deleteQuery);

                if (pagedFile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<FileModel>> { Item = pagedFile };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("getByDeleteQueryAndUser")]
        public ActionResult<ItemResponse<Paged<FileModel>>> GetByDeleteQueryAndUser(int pageSize, int pageIndex, bool deleteQuery)
        {
            int iCode = 200;
            BaseResponse response = null;

            int userId = _authService.GetCurrentUserId();

            try
            {
                Paged<FileModel> pagedFile = _service.GetByDeleteQueryAndUser(userId, pageSize, pageIndex, deleteQuery);

                if (pagedFile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<FileModel>> { Item = pagedFile };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("createdby")]
        public ActionResult<ItemResponse<Paged<FileModel>>> GetByCreatedBy(int id, int pageSize, int pageIndex)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<FileModel> pagedFile = _service.GetByCreatedBy(id, pageSize, pageIndex);

                if (pagedFile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<FileModel>> { Item = pagedFile };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<FileModel>>> GetBySearchName(string search, int pageSize, int pageIndex, bool deleteQuery)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<FileModel> pagedFile = _service.GetBySearchName(search, pageSize, pageIndex, deleteQuery);

                if (pagedFile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<FileModel>> { Item = pagedFile };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("searchWithUserId")]
        public ActionResult<ItemResponse<Paged<FileModel>>> GetSearchWithUserIdAndDeleteQuery(string search, int pageSize, int pageIndex, bool deleteQuery)
        {
            int iCode = 200;
            BaseResponse response = null;

            int userId = _authService.GetCurrentUserId();

            try
            {
                Paged<FileModel> pagedFile = _service.GetSearchWithUserIdAndDeleteQuery(userId, search, pageSize, pageIndex, deleteQuery);

                if (pagedFile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<FileModel>> { Item = pagedFile };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(FileUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpPost]
        public ActionResult<ItemsResponse<UploadedFile>> MultiFile(List<IFormFile> fileList)
        {
            BaseResponse response = null;
            int iCode = 201;

            try
            {
                List<UploadedFile> list = _service.UploadFile(fileList, _awsStorageConfig);
                response = new ItemsResponse<UploadedFile> { Items = list };
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);

            }

            return StatusCode(iCode, response);
        }
    }
}
