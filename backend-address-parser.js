// Backend Address Parser for Setup Modals
// This file shows how to parse the single address input into separate database fields

// ============================================================================
// ADDRESS PARSING FUNCTIONS
// ============================================================================

/**
 * Parse single address string into separate components
 * @param {string} addressString - Format: "No, Street Name, Town, City"
 * @returns {object} Parsed address components
 */
function parseAddress(addressString) {
  if (!addressString || addressString.trim() === '') {
    return {
      addressNo: '',
      streetName: '',
      town: '',
      city: '',
      isValid: false,
      error: 'Address is required'
    };
  }

  const parts = addressString.split(',').map(part => part.trim());
  
  if (parts.length < 4) {
    return {
      addressNo: parts[0] || '',
      streetName: parts[1] || '',
      town: parts[2] || '',
      city: parts[3] || '',
      isValid: false,
      error: 'Address must include: No, Street, Town, City'
    };
  }

  return {
    addressNo: parts[0],
    streetName: parts[1],
    town: parts[2],
    city: parts[3],
    isValid: true,
    error: null
  };
}

/**
 * Validate address format before parsing
 * @param {string} addressString
 * @returns {boolean}
 */
function validateAddressFormat(addressString) {
  if (!addressString) return false;
  
  const commaCount = (addressString.match(/,/g) || []).length;
  return commaCount >= 3; // Should have at least 3 commas for 4 parts
}

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Bank Model with parsed address fields
 */
class Bank {
  constructor(data) {
    this.id = data.id || null;
    this.code = data.code || '';
    this.description = data.description || '';
    this.addressNo = data.addressNo || '';
    this.streetName = data.streetName || '';
    this.town = data.town || '';
    this.city = data.city || '';
    this.district = data.district || '';
    this.swiftCode = data.swiftCode || '';
    this.branchNo = data.branchNo || '';
  }

  static fromFormData(formData) {
    const parsedAddress = parseAddress(formData.address);
    
    return new Bank({
      code: formData.code,
      description: formData.description,
      addressNo: parsedAddress.addressNo,
      streetName: parsedAddress.streetName,
      town: parsedAddress.town,
      city: parsedAddress.city,
      district: formData.district,
      swiftCode: formData.swiftCode,
      branchNo: formData.branchNo
    });
  }

  toDatabase() {
    return {
      code: this.code,
      description: this.description,
      address_no: this.addressNo,
      street_name: this.streetName,
      town: this.town,
      city: this.city,
      district: this.district,
      swift_code: this.swiftCode,
      branch_no: this.branchNo
    };
  }
}

/**
 * Trustee Model with parsed address fields
 */
class Trustee {
  constructor(data) {
    this.id = data.id || null;
    this.trusteeCode = data.trusteeCode || '';
    this.active = data.active || false;
    this.trusteeName = data.trusteeName || '';
    this.addressNo = data.addressNo || '';
    this.streetName = data.streetName || '';
    this.town = data.town || '';
    this.city = data.city || '';
    this.telephoneNumber = data.telephoneNumber || '';
    this.faxNo = data.faxNo || '';
    this.email = data.email || '';
  }

  static fromFormData(formData) {
    const parsedAddress = parseAddress(formData.trusteeAddress);
    
    return new Trustee({
      trusteeCode: formData.trusteeCode,
      active: formData.active,
      trusteeName: formData.trusteeName,
      addressNo: parsedAddress.addressNo,
      streetName: parsedAddress.streetName,
      town: parsedAddress.town,
      city: parsedAddress.city,
      telephoneNumber: formData.telephoneNumber,
      faxNo: formData.faxNo,
      email: formData.email
    });
  }

  toDatabase() {
    return {
      trustee_code: this.trusteeCode,
      active: this.active,
      trustee_name: this.trusteeName,
      address_no: this.addressNo,
      street_name: this.streetName,
      town: this.town,
      city: this.city,
      telephone_number: this.telephoneNumber,
      fax_no: this.faxNo,
      email: this.email
    };
  }
}

// ============================================================================
// API ENDPOINTS (Express.js Example)
// ============================================================================

/**
 * Express.js API endpoints for handling address parsing
 */
function setupAddressAPI(app) {
  
  // POST /api/banks - Create new bank
  app.post('/api/banks', async (req, res) => {
    try {
      const { address, ...otherData } = req.body;
      
      // Parse address
      const parsedAddress = parseAddress(address);
      
      if (!parsedAddress.isValid) {
        return res.status(400).json({
          success: false,
          error: parsedAddress.error
        });
      }

      // Create bank object
      const bank = Bank.fromFormData(req.body);
      
      // Save to database
      const savedBank = await saveBankToDatabase(bank.toDatabase());
      
      res.json({
        success: true,
        data: savedBank,
        message: 'Bank created successfully'
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create bank',
        details: error.message
      });
    }
  });

  // POST /api/trustees - Create new trustee
  app.post('/api/trustees', async (req, res) => {
    try {
      const { trusteeAddress, ...otherData } = req.body;
      
      // Parse address
      const parsedAddress = parseAddress(trusteeAddress);
      
      if (!parsedAddress.isValid) {
        return res.status(400).json({
          success: false,
          error: parsedAddress.error
        });
      }

      // Create trustee object
      const trustee = Trustee.fromFormData(req.body);
      
      // Save to database
      const savedTrustee = await saveTrusteeToDatabase(trustee.toDatabase());
      
      res.json({
        success: true,
        data: savedTrustee,
        message: 'Trustee created successfully'
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create trustee',
        details: error.message
      });
    }
  });

  // GET /api/banks/:id - Get bank with parsed address
  app.get('/api/banks/:id', async (req, res) => {
    try {
      const bank = await getBankFromDatabase(req.params.id);
      
      if (!bank) {
        return res.status(404).json({
          success: false,
          error: 'Bank not found'
        });
      }

      // Combine address parts for frontend
      const addressString = `${bank.address_no}, ${bank.street_name}, ${bank.town}, ${bank.city}`;
      
      res.json({
        success: true,
        data: {
          ...bank,
          address: addressString
        }
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve bank',
        details: error.message
      });
    }
  });
}

// ============================================================================
// DATABASE FUNCTIONS (Example implementations)
// ============================================================================

async function saveBankToDatabase(bankData) {
  // Example database save function
  // Replace with your actual database implementation
  console.log('Saving bank to database:', bankData);
  
  // Simulate database save
  return {
    id: Math.floor(Math.random() * 1000),
    ...bankData
  };
}

async function saveTrusteeToDatabase(trusteeData) {
  // Example database save function
  // Replace with your actual database implementation
  console.log('Saving trustee to database:', trusteeData);
  
  // Simulate database save
  return {
    id: Math.floor(Math.random() * 1000),
    ...trusteeData
  };
}

async function getBankFromDatabase(id) {
  // Example database retrieve function
  // Replace with your actual database implementation
  console.log('Retrieving bank from database:', id);
  
  // Simulate database retrieve
  return {
    id: id,
    code: 'B001',
    description: 'Sample Bank',
    address_no: '123',
    street_name: 'Main Street',
    town: 'Downtown',
    city: 'New York',
    district: 'North',
    swift_code: 'SWIFT123',
    branch_no: 'BR001'
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example usage
function exampleUsage() {
  console.log('=== ADDRESS PARSING EXAMPLES ===');
  
  // Valid address
  const validAddress = "123, Main Street, Downtown, New York";
  console.log('Valid address:', validAddress);
  console.log('Parsed:', parseAddress(validAddress));
  
  // Invalid address (missing parts)
  const invalidAddress = "123, Main Street";
  console.log('Invalid address:', invalidAddress);
  console.log('Parsed:', parseAddress(invalidAddress));
  
  // Empty address
  const emptyAddress = "";
  console.log('Empty address:', emptyAddress);
  console.log('Parsed:', parseAddress(emptyAddress));
  
  console.log('\n=== BANK MODEL EXAMPLE ===');
  const bankFormData = {
    code: 'B001',
    description: 'Sample Bank',
    address: '123, Main Street, Downtown, New York',
    district: 'North',
    swiftCode: 'SWIFT123',
    branchNo: 'BR001'
  };
  
  const bank = Bank.fromFormData(bankFormData);
  console.log('Bank object:', bank);
  console.log('Database format:', bank.toDatabase());
  
  console.log('\n=== TRUSTEE MODEL EXAMPLE ===');
  const trusteeFormData = {
    trusteeCode: 'T001',
    active: true,
    trusteeName: 'John Smith',
    trusteeAddress: '456, Oak Avenue, Midtown, Los Angeles',
    telephoneNumber: '+1-555-0123',
    faxNo: '+1-555-0124',
    email: 'john@trustcorp.com'
  };
  
  const trustee = Trustee.fromFormData(trusteeFormData);
  console.log('Trustee object:', trustee);
  console.log('Database format:', trustee.toDatabase());
}

// Run examples if this file is executed directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseAddress,
    validateAddressFormat,
    Bank,
    Trustee,
    setupAddressAPI
  };
  
  // Run examples
  exampleUsage();
}

// ============================================================================
// SQL DATABASE SCHEMA
// ============================================================================

/*
-- Bank table with separate address columns
CREATE TABLE banks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  address_no VARCHAR(50),
  street_name VARCHAR(255),
  town VARCHAR(100),
  city VARCHAR(100),
  district VARCHAR(100),
  swift_code VARCHAR(50),
  branch_no VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trustee table with separate address columns
CREATE TABLE trustees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trustee_code VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  trustee_name VARCHAR(255),
  address_no VARCHAR(50),
  street_name VARCHAR(255),
  town VARCHAR(100),
  city VARCHAR(100),
  telephone_number VARCHAR(50),
  fax_no VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/

console.log('Backend Address Parser loaded successfully!'); 