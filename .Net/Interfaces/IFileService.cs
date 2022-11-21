using Microsoft.AspNetCore.Http;
using Sabio.Models;
using Sabio.Models.Domain.File;
using Sabio.Models.Requests;
using Sabio.Models.Requests.File;
using Sabio.Web.Core.Configs;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IFileService
    {
        List<UploadedFile> UploadFile(List<IFormFile> fileList, AWSStorageConfig _awsStorageConfig);
        void Delete(int id);
        Paged<FileModel> GetByCreatedBy(int id, int pageSize, int pageIndex);
        public Paged<FileModel> GetByDeleteQueryAndUser(int userId, int pageSize, int pageIndex, bool deleteQuery);
        Paged<FileModel> GetByFileTypeId(int id, int pageSize, int pageIndex);
        FileModel GetById(int id);
        Paged<FileModel> GetAll(int pageSize, int pageIndex);
        public Paged<FileModel> GetByDeleteQuery(int pageSize, int pageIndex, bool deleteQuery);
        public Paged<FileModel> GetBySearchName(string search, int pageSize, int pageIndex, bool deleteQuery);
        public Paged<FileModel> GetSearchWithUserIdAndDeleteQuery(int userId, string search, int pageSize, int pageIndex, bool deleteQuery);
        void Update(FileUpdateRequest model);

    }
}