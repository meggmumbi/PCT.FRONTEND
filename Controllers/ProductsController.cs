using Azure;
using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Text;

namespace ICL.React.Frontend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _memoryCache;
        private IConfiguration _configuration;

        public ProductsController(HttpClient httpClient, IMemoryCache memoryCache, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _memoryCache = memoryCache;
            _configuration = configuration;

            // Get and set memory cache
            var accessToken = _memoryCache.Get<string>("AccessToken");
            var tokenExpirationTime = _memoryCache.Get<DateTime>("TokenExpirationTime");
            if (accessToken == null || tokenExpirationTime == null || DateTime.UtcNow >= tokenExpirationTime)
            {
                string clientId = _configuration["ClientId"];
                string secret = _configuration["Secret"];
                string apiUrl = _configuration["ApiURL"];
                string username = _configuration["pcmt_username"];
                string password = _configuration["pcmt_password"];

                // Create the payload data in JSON format
                string payload = $"{{ \"grant_type\": \"password\", \"username\": \"{username}\", \"password\": \"{password}\" }}";
                StringContent content = new StringContent(payload, Encoding.UTF8, "application/json");

                string base64Auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{secret}"));
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", base64Auth);

                // Send the POST request and get the response
                HttpResponseMessage response = _httpClient.PostAsync(apiUrl, content).Result;
                if (response.IsSuccessStatusCode)
                {
                    // Read the response content as a string
                    string responseContent = response.Content.ReadAsStringAsync().Result;
                    PCMTResponse pCMTResponse = JsonConvert.DeserializeObject<PCMTResponse>(responseContent);
                    accessToken = pCMTResponse.access_token;
                    // Cache access token and expiration time
                    var expiresIn = TimeSpan.FromSeconds(pCMTResponse.expires_in);
                    tokenExpirationTime = DateTime.UtcNow.Add(expiresIn);
                    _memoryCache.Set("AccessToken", accessToken, expiresIn);
                    _memoryCache.Set("TokenExpirationTime", tokenExpirationTime, expiresIn);
                }
                else
                {
                    response.Dispose();
                }
            }
        }




        [HttpGet("GetProducts")]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var accessToken = _memoryCache.Get<string>("AccessToken");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                string apiUrl = "https://productcatalog.eastus.cloudapp.azure.com/api/rest/v1/products?limit=100";
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return Ok(responseBody);
                }
                else
                {
                    return StatusCode((int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }






        [HttpGet("GetFamilies")]
        public async Task<IActionResult> GetProductFamilies()
        {
            try
            {
                var accessToken = _memoryCache.Get<string>("AccessToken");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                string apiUrl = "https://productcatalog.eastus.cloudapp.azure.com/api/rest/v1/families?limit=100";
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode) {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return Ok(responseBody);
                } else {
                    return StatusCode((int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }

        [HttpGet("GetFamilyProducts")]
        public async Task<IActionResult> GetProductsInFamily(string familyCode) {
            try
            {
                var accessToken = _memoryCache.Get<string>("AccessToken");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                string apiUrl = $"https://productcatalog.eastus.cloudapp.azure.com/api/rest/v1/products?search={{\"family\":[{{\"operator\":\"IN\",\"value\":[\"{familyCode}\"]}}]}}";
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return Ok(responseBody);
                }
                else
                {
                    return StatusCode((int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }

        [HttpGet("GetOrders")]
        public async Task<IActionResult> GetUserOrders(string email)
        {
            try
            {
                string apiBaseUrl = _configuration.GetValue<string>("DWH_URI");


                string apiUrl = $"{apiBaseUrl}/api/order/GetOrders/{email}";             
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return Ok(responseBody);
                }
                else
                {
                    return StatusCode((int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }

        [HttpGet("GetHistoricalOrders")]
        public async Task<IActionResult> GetHistoricalOrders()
        {
            try
            {
                string apiBaseUrl = _configuration.GetValue<string>("DWH_URI");


                string apiUrl = $"{apiBaseUrl}/api/order/GetOrders";
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return Ok(responseBody);
                }
                else
                {
                    return StatusCode((int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }


        [HttpGet("GetImage")]
        public async Task<IActionResult> GetImage(string imageURL) {
            try
            {
                var accessToken = _memoryCache.Get<string>("AccessToken");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                string apiUrl = imageURL;
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                var contentType = response.Content.Headers.ContentType?.MediaType;
                Console.WriteLine("Content-Type: " + contentType);
                if (response.IsSuccessStatusCode)
                {
                    // Ensure the Content-Type is an image type (e.g., "image/jpeg", "image/png", etc.)
                    if (response.Content.Headers.ContentType.MediaType.StartsWith("image/"))
                    {
                        // Read the image data as a byte array
                        byte[] imageBytes = await response.Content.ReadAsByteArrayAsync();

                        // Return the image as a FileResult
                        return File(imageBytes, response.Content.Headers.ContentType.MediaType);
                    }
                    else
                    {
                        // If the response is not an image, handle the error accordingly.
                        return StatusCode((int)response.StatusCode);
                    }
                }
                else
                {
                    return StatusCode((int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }


        [HttpGet("GetProductSelected")]
        public async Task<IActionResult> GetProductSelected(string identifier)
        {
            try
            {
                var accessToken = _memoryCache.Get<string>("AccessToken");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                string apiUrl = $"https://productcatalog.eastus.cloudapp.azure.com/api/rest/v1/products/{identifier}";
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return Ok(responseBody);
                }
                else
                {
                    return StatusCode((int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred: " + ex.Message);
            }
        }
    
    
    
    }


    public class PCMTResponse
    {
        public string access_token { get; set; }
        public int expires_in { get; set; }
        public string token_type { get; set; }
        public string refresh_token { get; set; }
    }
}

