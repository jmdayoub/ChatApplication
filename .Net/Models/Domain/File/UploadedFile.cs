using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.File
{
    public class UploadedFile
    {
        public int Id { get; set; }
        public string Url { get; set; }

        public UploadedFile(int id, string url)
        {
            Id = id;
            Url = url;
        }
    }
}
