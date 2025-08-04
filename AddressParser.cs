using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace IRFO.Backend.Models
{
    // ============================================================================
    // ADDRESS PARSING MODELS
    // ============================================================================

    /// <summary>
    /// Parsed address result with validation
    /// </summary>
    public class ParsedAddress
    {
        public string AddressNo { get; set; } = string.Empty;
        public string StreetName { get; set; } = string.Empty;
        public string Town { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public bool IsValid { get; set; }
        public string Error { get; set; } = string.Empty;

        public ParsedAddress()
        {
        }

        public ParsedAddress(string addressNo, string streetName, string town, string city)
        {
            AddressNo = addressNo;
            StreetName = streetName;
            Town = town;
            City = city;
            IsValid = true;
        }

        public ParsedAddress(string error)
        {
            IsValid = false;
            Error = error;
        }
    }

    /// <summary>
    /// Address parser utility class
    /// </summary>
    public static class AddressParser
    {
        /// <summary>
        /// Parse single address string into separate components
        /// Format: "No, Street Name, Town, City"
        /// </summary>
        /// <param name="addressString">Address string to parse</param>
        /// <returns>Parsed address with validation</returns>
        public static ParsedAddress ParseAddress(string addressString)
        {
            if (string.IsNullOrWhiteSpace(addressString))
            {
                return new ParsedAddress("Address is required");
            }

            var parts = addressString.Split(',')
                                   .Select(part => part.Trim())
                                   .ToArray();

            if (parts.Length < 4)
            {
                return new ParsedAddress(
                    parts.Length > 0 ? parts[0] : string.Empty,
                    parts.Length > 1 ? parts[1] : string.Empty,
                    parts.Length > 2 ? parts[2] : string.Empty,
                    parts.Length > 3 ? parts[3] : string.Empty
                )
                {
                    IsValid = false,
                    Error = "Address must include: No, Street, Town, City"
                };
            }

            return new ParsedAddress(parts[0], parts[1], parts[2], parts[3]);
        }

        /// <summary>
        /// Validate address format before parsing
        /// </summary>
        /// <param name="addressString">Address string to validate</param>
        /// <returns>True if valid format</returns>
        public static bool ValidateAddressFormat(string addressString)
        {
            if (string.IsNullOrWhiteSpace(addressString))
                return false;

            var commaCount = addressString.Count(c => c == ',');
            return commaCount >= 3; // Should have at least 3 commas for 4 parts
        }

        /// <summary>
        /// Combine address parts back to string format
        /// </summary>
        /// <param name="addressNo">Address number</param>
        /// <param name="streetName">Street name</param>
        /// <param name="town">Town</param>
        /// <param name="city">City</param>
        /// <returns>Combined address string</returns>
        public static string CombineAddress(string addressNo, string streetName, string town, string city)
        {
            return $"{addressNo}, {streetName}, {town}, {city}";
        }
    }

    // ============================================================================
    // DATABASE MODELS
    // ============================================================================

    /// <summary>
    /// Bank entity model
    /// </summary>
    public class Bank
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string AddressNo { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string StreetName { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Town { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string City { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string District { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string SwiftCode { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string BranchNo { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Create Bank from form data with address parsing
        /// </summary>
        public static Bank FromFormData(BankFormData formData)
        {
            var parsedAddress = AddressParser.ParseAddress(formData.Address);
            
            return new Bank
            {
                Code = formData.Code,
                Description = formData.Description,
                AddressNo = parsedAddress.AddressNo,
                StreetName = parsedAddress.StreetName,
                Town = parsedAddress.Town,
                City = parsedAddress.City,
                District = formData.District,
                SwiftCode = formData.SwiftCode,
                BranchNo = formData.BranchNo
            };
        }

        /// <summary>
        /// Get combined address string for frontend
        /// </summary>
        public string GetCombinedAddress()
        {
            return AddressParser.CombineAddress(AddressNo, StreetName, Town, City);
        }
    }

    /// <summary>
    /// Trustee entity model
    /// </summary>
    public class Trustee
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string TrusteeCode { get; set; } = string.Empty;
        
        public bool Active { get; set; } = true;
        
        [StringLength(255)]
        public string TrusteeName { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string AddressNo { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string StreetName { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Town { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string City { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string TelephoneNumber { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string FaxNo { get; set; } = string.Empty;
        
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Create Trustee from form data with address parsing
        /// </summary>
        public static Trustee FromFormData(TrusteeFormData formData)
        {
            var parsedAddress = AddressParser.ParseAddress(formData.TrusteeAddress);
            
            return new Trustee
            {
                TrusteeCode = formData.TrusteeCode,
                Active = formData.Active,
                TrusteeName = formData.TrusteeName,
                AddressNo = parsedAddress.AddressNo,
                StreetName = parsedAddress.StreetName,
                Town = parsedAddress.Town,
                City = parsedAddress.City,
                TelephoneNumber = formData.TelephoneNumber,
                FaxNo = formData.FaxNo,
                Email = formData.Email
            };
        }

        /// <summary>
        /// Get combined address string for frontend
        /// </summary>
        public string GetCombinedAddress()
        {
            return AddressParser.CombineAddress(AddressNo, StreetName, Town, City);
        }
    }

    // ============================================================================
    // FORM DATA MODELS (for API requests)
    // ============================================================================

    /// <summary>
    /// Bank form data from frontend
    /// </summary>
    public class BankFormData
    {
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty; // Single address field
        public string District { get; set; } = string.Empty;
        public string SwiftCode { get; set; } = string.Empty;
        public string BranchNo { get; set; } = string.Empty;
    }

    /// <summary>
    /// Trustee form data from frontend
    /// </summary>
    public class TrusteeFormData
    {
        public string TrusteeCode { get; set; } = string.Empty;
        public bool Active { get; set; } = true;
        public string TrusteeName { get; set; } = string.Empty;
        public string TrusteeAddress { get; set; } = string.Empty; // Single address field
        public string TelephoneNumber { get; set; } = string.Empty;
        public string FaxNo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // ============================================================================
    // API RESPONSE MODELS
    // ============================================================================

    /// <summary>
    /// Standard API response
    /// </summary>
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Error { get; set; } = string.Empty;
    }

    // ============================================================================
    // API CONTROLLERS
    // ============================================================================

    /// <summary>
    /// Bank API controller
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class BanksController : ControllerBase
    {
        private readonly IBankService _bankService;

        public BanksController(IBankService bankService)
        {
            _bankService = bankService;
        }

        /// <summary>
        /// Create new bank
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Bank>>> CreateBank([FromBody] BankFormData formData)
        {
            try
            {
                // Parse and validate address
                var parsedAddress = AddressParser.ParseAddress(formData.Address);
                
                if (!parsedAddress.IsValid)
                {
                    return BadRequest(new ApiResponse<Bank>
                    {
                        Success = false,
                        Error = parsedAddress.Error
                    });
                }

                // Create bank entity
                var bank = Bank.FromFormData(formData);
                
                // Save to database
                var savedBank = await _bankService.CreateAsync(bank);
                
                return Ok(new ApiResponse<Bank>
                {
                    Success = true,
                    Data = savedBank,
                    Message = "Bank created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<Bank>
                {
                    Success = false,
                    Error = "Failed to create bank",
                    Message = ex.Message
                });
            }
        }

        /// <summary>
        /// Get bank by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<BankFormData>>> GetBank(int id)
        {
            try
            {
                var bank = await _bankService.GetByIdAsync(id);
                
                if (bank == null)
                {
                    return NotFound(new ApiResponse<BankFormData>
                    {
                        Success = false,
                        Error = "Bank not found"
                    });
                }

                // Convert back to form data for frontend
                var formData = new BankFormData
                {
                    Code = bank.Code,
                    Description = bank.Description,
                    Address = bank.GetCombinedAddress(), // Combine address parts
                    District = bank.District,
                    SwiftCode = bank.SwiftCode,
                    BranchNo = bank.BranchNo
                };

                return Ok(new ApiResponse<BankFormData>
                {
                    Success = true,
                    Data = formData
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<BankFormData>
                {
                    Success = false,
                    Error = "Failed to retrieve bank",
                    Message = ex.Message
                });
            }
        }

        /// <summary>
        /// Update bank
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<Bank>>> UpdateBank(int id, [FromBody] BankFormData formData)
        {
            try
            {
                // Parse and validate address
                var parsedAddress = AddressParser.ParseAddress(formData.Address);
                
                if (!parsedAddress.IsValid)
                {
                    return BadRequest(new ApiResponse<Bank>
                    {
                        Success = false,
                        Error = parsedAddress.Error
                    });
                }

                // Get existing bank
                var existingBank = await _bankService.GetByIdAsync(id);
                if (existingBank == null)
                {
                    return NotFound(new ApiResponse<Bank>
                    {
                        Success = false,
                        Error = "Bank not found"
                    });
                }

                // Update with new data
                var updatedBank = Bank.FromFormData(formData);
                updatedBank.Id = id;
                updatedBank.CreatedAt = existingBank.CreatedAt;
                updatedBank.UpdatedAt = DateTime.UtcNow;

                var savedBank = await _bankService.UpdateAsync(updatedBank);

                return Ok(new ApiResponse<Bank>
                {
                    Success = true,
                    Data = savedBank,
                    Message = "Bank updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<Bank>
                {
                    Success = false,
                    Error = "Failed to update bank",
                    Message = ex.Message
                });
            }
        }
    }

    /// <summary>
    /// Trustee API controller
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class TrusteesController : ControllerBase
    {
        private readonly ITrusteeService _trusteeService;

        public TrusteesController(ITrusteeService trusteeService)
        {
            _trusteeService = trusteeService;
        }

        /// <summary>
        /// Create new trustee
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Trustee>>> CreateTrustee([FromBody] TrusteeFormData formData)
        {
            try
            {
                // Parse and validate address
                var parsedAddress = AddressParser.ParseAddress(formData.TrusteeAddress);
                
                if (!parsedAddress.IsValid)
                {
                    return BadRequest(new ApiResponse<Trustee>
                    {
                        Success = false,
                        Error = parsedAddress.Error
                    });
                }

                // Create trustee entity
                var trustee = Trustee.FromFormData(formData);
                
                // Save to database
                var savedTrustee = await _trusteeService.CreateAsync(trustee);
                
                return Ok(new ApiResponse<Trustee>
                {
                    Success = true,
                    Data = savedTrustee,
                    Message = "Trustee created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<Trustee>
                {
                    Success = false,
                    Error = "Failed to create trustee",
                    Message = ex.Message
                });
            }
        }

        /// <summary>
        /// Get trustee by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TrusteeFormData>>> GetTrustee(int id)
        {
            try
            {
                var trustee = await _trusteeService.GetByIdAsync(id);
                
                if (trustee == null)
                {
                    return NotFound(new ApiResponse<TrusteeFormData>
                    {
                        Success = false,
                        Error = "Trustee not found"
                    });
                }

                // Convert back to form data for frontend
                var formData = new TrusteeFormData
                {
                    TrusteeCode = trustee.TrusteeCode,
                    Active = trustee.Active,
                    TrusteeName = trustee.TrusteeName,
                    TrusteeAddress = trustee.GetCombinedAddress(), // Combine address parts
                    TelephoneNumber = trustee.TelephoneNumber,
                    FaxNo = trustee.FaxNo,
                    Email = trustee.Email
                };

                return Ok(new ApiResponse<TrusteeFormData>
                {
                    Success = true,
                    Data = formData
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<TrusteeFormData>
                {
                    Success = false,
                    Error = "Failed to retrieve trustee",
                    Message = ex.Message
                });
            }
        }
    }

    // ============================================================================
    // SERVICE INTERFACES
    // ============================================================================

    public interface IBankService
    {
        Task<Bank> CreateAsync(Bank bank);
        Task<Bank?> GetByIdAsync(int id);
        Task<Bank> UpdateAsync(Bank bank);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Bank>> GetAllAsync();
    }

    public interface ITrusteeService
    {
        Task<Trustee> CreateAsync(Trustee trustee);
        Task<Trustee?> GetByIdAsync(int id);
        Task<Trustee> UpdateAsync(Trustee trustee);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Trustee>> GetAllAsync();
    }

    // ============================================================================
    // USAGE EXAMPLES
    // ============================================================================

    public static class AddressParserExamples
    {
        public static void RunExamples()
        {
            Console.WriteLine("=== ADDRESS PARSING EXAMPLES ===");
            
            // Valid address
            var validAddress = "123, Main Street, Downtown, New York";
            Console.WriteLine($"Valid address: {validAddress}");
            var parsed = AddressParser.ParseAddress(validAddress);
            Console.WriteLine($"Parsed: AddressNo={parsed.AddressNo}, StreetName={parsed.StreetName}, Town={parsed.Town}, City={parsed.City}, IsValid={parsed.IsValid}");
            
            // Invalid address (missing parts)
            var invalidAddress = "123, Main Street";
            Console.WriteLine($"Invalid address: {invalidAddress}");
            var parsedInvalid = AddressParser.ParseAddress(invalidAddress);
            Console.WriteLine($"Parsed: IsValid={parsedInvalid.IsValid}, Error={parsedInvalid.Error}");
            
            // Empty address
            var emptyAddress = "";
            Console.WriteLine($"Empty address: '{emptyAddress}'");
            var parsedEmpty = AddressParser.ParseAddress(emptyAddress);
            Console.WriteLine($"Parsed: IsValid={parsedEmpty.IsValid}, Error={parsedEmpty.Error}");
            
            Console.WriteLine("\n=== BANK MODEL EXAMPLE ===");
            var bankFormData = new BankFormData
            {
                Code = "B001",
                Description = "Sample Bank",
                Address = "123, Main Street, Downtown, New York",
                District = "North",
                SwiftCode = "SWIFT123",
                BranchNo = "BR001"
            };
            
            var bank = Bank.FromFormData(bankFormData);
            Console.WriteLine($"Bank: Code={bank.Code}, AddressNo={bank.AddressNo}, StreetName={bank.StreetName}");
            Console.WriteLine($"Combined Address: {bank.GetCombinedAddress()}");
            
            Console.WriteLine("\n=== TRUSTEE MODEL EXAMPLE ===");
            var trusteeFormData = new TrusteeFormData
            {
                TrusteeCode = "T001",
                Active = true,
                TrusteeName = "John Smith",
                TrusteeAddress = "456, Oak Avenue, Midtown, Los Angeles",
                TelephoneNumber = "+1-555-0123",
                FaxNo = "+1-555-0124",
                Email = "john@trustcorp.com"
            };
            
            var trustee = Trustee.FromFormData(trusteeFormData);
            Console.WriteLine($"Trustee: Code={trustee.TrusteeCode}, AddressNo={trustee.AddressNo}, StreetName={trustee.StreetName}");
            Console.WriteLine($"Combined Address: {trustee.GetCombinedAddress()}");
        }
    }
}

/*
// ============================================================================
// ENTITY FRAMEWORK CONFIGURATION
// ============================================================================

// In your DbContext class:
public class ApplicationDbContext : DbContext
{
    public DbSet<Bank> Banks { get; set; }
    public DbSet<Trustee> Trustees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Bank configuration
        modelBuilder.Entity<Bank>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.AddressNo).HasMaxLength(50);
            entity.Property(e => e.StreetName).HasMaxLength(255);
            entity.Property(e => e.Town).HasMaxLength(100);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.SwiftCode).HasMaxLength(50);
            entity.Property(e => e.BranchNo).HasMaxLength(50);
        });

        // Trustee configuration
        modelBuilder.Entity<Trustee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TrusteeCode).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TrusteeName).HasMaxLength(255);
            entity.Property(e => e.AddressNo).HasMaxLength(50);
            entity.Property(e => e.StreetName).HasMaxLength(255);
            entity.Property(e => e.Town).HasMaxLength(100);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.TelephoneNumber).HasMaxLength(50);
            entity.Property(e => e.FaxNo).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(255);
        });
    }
}
*/ 