using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.File;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.File;
using Sabio.Services.Interfaces;
using Sabio.Web.Core.Configs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class FileService : IFileService
    {
        private IDataProvider _data = null;
        private IAuthenticationService<int> _authService = null;

        public FileService(IDataProvider data, IAuthenticationService<int> authService)
        {
            _data = data;
            _authService = authService;
        }
        public Paged<FileModel> GetAll(int pageSize, int pageIndex)
        {
            string procName = "[dbo].[Files_SelectAll]";
            Paged<FileModel> pagedFile = null;
            List<FileModel> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    FileModel aFile = MapSingleFile(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<FileModel>();
                    }

                    list.Add(aFile);
                });
            if (list != null)
            {
                pagedFile = new Paged<FileModel>(list, pageIndex, pageSize, totalCount);
            }

            return pagedFile;
        }
        public FileModel GetById(int id)
        {
            string procName = "[dbo].[Files_Select_ById]";
            FileModel aFile = null;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", id);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    aFile = MapSingleFile(reader, ref startingIndex);
                });

            return aFile;

        }
        public Paged<FileModel> GetByFileTypeId(int id, int pageSize, int pageIndex)
        {
            string procName = "[dbo].[Files_Select_ByFileTypeId]";
            Paged<FileModel> pagedFiles = null;
            List<FileModel> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@FileTypeId", id);
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: (Action<IDataReader, short>)delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    FileModel aFile = MapSingleFile(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<FileModel>();
                    }

                    list.Add((FileModel)aFile);

                });
            if (list != null)
            {
                pagedFiles = new Paged<FileModel>(list, pageIndex, pageSize, totalCount);
            }

            return pagedFiles;
        }
        public Paged<FileModel> GetByCreatedBy(int id, int pageSize, int pageIndex)
        {
            string procName = "[dbo].[Files_Select_ByCreatedBy]";
            Paged<FileModel> pagedFiles = null;
            List<FileModel> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserId", id);
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: (Action<IDataReader, short>)delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    FileModel aFile = MapSingleFile(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<FileModel>();
                    }

                    list.Add((FileModel)aFile);

                });
            if (list != null)
            {
                pagedFiles = new Paged<FileModel>(list, pageIndex, pageSize, totalCount);
            }

            return pagedFiles;
        }
        public Paged<FileModel> GetByDeleteQuery(int pageSize, int pageIndex, bool deleteQuery)
        {
            string procName = "[dbo].[Files_Select_By_IsDeleted]";
            Paged<FileModel> pagedFiles = null;
            List<FileModel> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@DeleteQuery", deleteQuery);
                },
                singleRecordMapper: (Action<IDataReader, short>)delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    FileModel aFile = MapSingleFile(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<FileModel>();
                    }

                    list.Add((FileModel)aFile);

                });
            if (list != null)
            {
                pagedFiles = new Paged<FileModel>(list, pageIndex, pageSize, totalCount);
            }

            return pagedFiles;
        }
        public Paged<FileModel> GetByDeleteQueryAndUser(int userId, int pageSize, int pageIndex, bool deleteQuery)
        {
            string procName = "[dbo].[Files_Select_By_IsDeleted_And_User]";
            Paged<FileModel> pagedFiles = null;
            List<FileModel> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserQuery", userId);
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@DeleteQuery", deleteQuery);
                },
                singleRecordMapper: (Action<IDataReader, short>)delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    FileModel aFile = MapSingleFile(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<FileModel>();
                    }

                    list.Add((FileModel)aFile);

                });
            if (list != null)
            {
                pagedFiles = new Paged<FileModel>(list, pageIndex, pageSize, totalCount);
            }

            return pagedFiles;
        }
        public Paged<FileModel> GetBySearchName(string search, int pageSize, int pageIndex, bool deleteQuery)
        {
            string procName = "[dbo].[Files_Select_Name]";
            Paged<FileModel> pagedFiles = null;
            List<FileModel> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@FileName", search);
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@DeleteQuery", deleteQuery);
                },
                singleRecordMapper: (Action<IDataReader, short>)delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    FileModel aFile = MapSingleFile(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<FileModel>();
                    }

                    list.Add((FileModel)aFile);

                });
            if (list != null)
            {
                pagedFiles = new Paged<FileModel>(list, pageIndex, pageSize, totalCount);
            }

            return pagedFiles;
        }
        public Paged<FileModel> GetSearchWithUserIdAndDeleteQuery(int userId, string search, int pageSize, int pageIndex, bool deleteQuery)
        {
            string procName = "[dbo].[Files_Select_Name_User]";
            Paged<FileModel> pagedFiles = null;
            List<FileModel> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserId", userId);
                    paramCollection.AddWithValue("@FileName", search);
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@DeleteQuery", deleteQuery);
                },
                singleRecordMapper: (Action<IDataReader, short>)delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    FileModel aFile = MapSingleFile(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<FileModel>();
                    }

                    list.Add((FileModel)aFile);

                });
            if (list != null)
            {
                pagedFiles = new Paged<FileModel>(list, pageIndex, pageSize, totalCount);
            }

            return pagedFiles;
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[Files_Delete_ById]";
            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", id);
                });

        }
        public void Update(FileUpdateRequest model)
        {
            string procName = "[dbo].[Files_Update]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    AddCommonParams(model, paramCollection);
                    paramCollection.AddWithValue("@Id", model.Id);
                    paramCollection.AddWithValue("@IsDeleted", model.IsDeleted);

                });
        }
        public List<UploadedFile> UploadFile(List<IFormFile> fileList, AWSStorageConfig _awsStorageConfig)
        {
            Task<FileAddRequest> aFile = null;
            UploadedFile uploadedFile = null;
            List<UploadedFile> list = null;
            string procName = "[dbo].[Files_Insert]";

            int currentUser = _authService.GetCurrentUserId();
            int id = 0;

            foreach (IFormFile file in fileList)
            {
                aFile = UploadToAWS(file, _awsStorageConfig);

                _data.ExecuteNonQuery(procName
                    , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                    {
                        AddCommonParams(aFile.Result, paramCollection);
                        paramCollection.AddWithValue("@CreatedBy", currentUser);

                        SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);

                        idOut.Direction = ParameterDirection.Output;

                        paramCollection.Add(idOut);

                    }, returnParameters: delegate (SqlParameterCollection returnCollection)
                    {
                        object oId = returnCollection["@Id"].Value;
                        int.TryParse(oId.ToString(), out id);
                    });

                if (id != 0)
                {
                    uploadedFile = new UploadedFile(id, aFile.Result.Url);

                    if (list == null)
                    {
                        list = new List<UploadedFile>();
                    }

                    list.Add(uploadedFile);
                }
            };

            return list;
        }

        public async Task<FileAddRequest> UploadToAWS(IFormFile file, AWSStorageConfig _awsStorageConfig)
        {
            BasicAWSCredentials credentials = new BasicAWSCredentials(_awsStorageConfig.AccessKey, _awsStorageConfig.Secret);
            RegionEndpoint bucketRegion = RegionEndpoint.USWest2;
            string bucketName = _awsStorageConfig.BucketName;

            IAmazonS3 s3Client = new AmazonS3Client(credentials, bucketRegion);
            TransferUtility fileTransferUtility = new TransferUtility(s3Client);

            string fileName = Path.GetFileName(file.FileName).Replace(' ', '-');
            Guid guidId = Guid.NewGuid();
            string keyName = $"C120/{guidId}/{fileName}";
            string fileExtension = Path.GetExtension(file.FileName).Remove(0, 1);
            await fileTransferUtility.UploadAsync(file.OpenReadStream(), bucketName, keyName);
            string url = _awsStorageConfig.Domain + keyName;

            FileAddRequest aFile = new FileAddRequest();

            aFile.Name = fileName;
            aFile.Url = url;
            aFile.FileType = fileExtension;

            return aFile;
        }

        private static FileModel MapSingleFile(IDataReader reader, ref int startingIndex)
        {
            FileModel aFile = new FileModel();
            LookUp aLookUp = new LookUp();
            User currentUser = new User();

            aFile.Id = reader.GetSafeInt32(startingIndex++);
            aFile.Name = reader.GetSafeString(startingIndex++);
            aFile.Url = reader.GetSafeString(startingIndex++);

            aLookUp.Id = reader.GetSafeInt32(startingIndex++);
            aLookUp.Name = reader.GetSafeString(startingIndex++);
            aFile.FileType = aLookUp;

            aFile.IsDeleted = reader.GetSafeBool(startingIndex++);

            currentUser.Id = reader.GetSafeInt32(startingIndex++);
            currentUser.Title = reader.GetSafeString(startingIndex++);
            currentUser.FirstName = reader.GetSafeString(startingIndex++);
            currentUser.LastName = reader.GetSafeString(startingIndex++);
            aFile.CreatedBy = currentUser;

            aFile.DateCreated = reader.GetSafeDateTime(startingIndex++);

            return aFile;
        }
        private static void AddCommonParams(FileAddRequest model, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@Name", model.Name);
            paramCollection.AddWithValue("@Url", model.Url);
            paramCollection.AddWithValue("@FileType", model.FileType);
        }
    }
}
