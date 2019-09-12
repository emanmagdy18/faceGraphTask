using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace gallery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private string accountName = string.Empty, accessKey = string.Empty, Container = string.Empty;
        private StorageCredentials cred;
        private CloudStorageAccount acc;

        public ImagesController()
        {
            Container = "images";
            accountName = "fgtest3";
            accessKey = "ePycbjNKmeHKeBvK2T5F9AuUPRAj2d0s9irsMXGaoUYEElbL9yw91uElEZW2yrJp/t5tUCRcFc5Sqs/a/fUtGw==";
            cred = new StorageCredentials(accountName, accessKey);
            acc = new CloudStorageAccount(cred, useHttps: true);
        }

        [HttpGet]
        public async Task<List<IListBlobItem>> Get()
        {
            List<IListBlobItem> blobs = new List<IListBlobItem>();
            try
            {
                CloudBlobClient blobClient = acc.CreateCloudBlobClient();
                CloudBlobContainer container = blobClient.GetContainerReference(Container);
                BlobResultSegment resultSegment = await container.ListBlobsSegmentedAsync(null);
                foreach (IListBlobItem item in resultSegment.Results)
                {
                    if (item.GetType() == typeof(CloudBlockBlob))
                    {
                        CloudBlockBlob blob = (CloudBlockBlob)item;
                        blobs.Add(blob);
                    }
                    else if (item.GetType() == typeof(CloudPageBlob))
                    {
                        CloudPageBlob blob = (CloudPageBlob)item;
                        blobs.Add(blob);
                    }
                    else if (item.GetType() == typeof(CloudBlobDirectory))
                    {
                        CloudBlobDirectory dir = (CloudBlobDirectory)item;
                        blobs.Add(dir);
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return blobs;
        }

        [HttpPost("insertNewImg")]
        public async Task<bool> insertNewImg(IFormFile model)
        {
            try
            {
                CloudBlobClient blobClient = acc.CreateCloudBlobClient();
                CloudBlobContainer container = blobClient.GetContainerReference(Container);
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(model.FileName);
                await blockBlob.UploadFromStreamAsync(model.OpenReadStream());

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpGet("downloadImg/{fileName}")]
        public async Task<IActionResult> downloadImg(string fileName)
        {
            MemoryStream ms = new MemoryStream();
            CloudBlobClient BlobClient = acc.CreateCloudBlobClient();
            CloudBlobContainer container = BlobClient.GetContainerReference(Container);

            if (await container.ExistsAsync())
            {
                CloudBlob file = container.GetBlobReference(fileName);
                if (await file.ExistsAsync())
                {
                    await file.DownloadToStreamAsync(ms);
                    Stream blobStream = file.OpenReadAsync().Result;
                    return File(blobStream, file.Properties.ContentType, file.Name);
                }
                else
                {
                    return Content("File does not exist");
                }
            }
            else
            {
                return Content("Container does not exist");
            }
        }


        [HttpGet("deleteImg/{fileName}")]
        public async Task<bool> deleteImg(string fileName)
        {
            try
            {
                CloudBlobClient BlobClient = acc.CreateCloudBlobClient();
                CloudBlobContainer container = BlobClient.GetContainerReference(Container);

                if (await container.ExistsAsync())
                {
                    CloudBlob file = container.GetBlobReference(fileName);

                    if (await file.ExistsAsync())
                    {
                        await file.DeleteAsync();
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        
        [HttpGet("deleteAllImgs")]
        public async Task<bool> deleteAllImgs()
        {
            try
            {
                CloudBlobClient BlobClient = acc.CreateCloudBlobClient();
                CloudBlobContainer container = BlobClient.GetContainerReference(Container);

                if (await container.ExistsAsync())
                {
                    BlobResultSegment resultSegment = await container.ListBlobsSegmentedAsync(null);
                    foreach (IListBlobItem item in resultSegment.Results)
                    {
                        CloudBlockBlob blob = (CloudBlockBlob) item;
                        CloudBlob file = container.GetBlobReference(blob.Name);
                        if (await file.ExistsAsync())
                        {
                            await file.DeleteAsync();
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}