#!/usr/bin/env node

/**
 * Web3Auth Blockchain Diagnostics Script
 * 
 * This script checks your environment and tests the blockchain connection
 * to help identify issues with Web3Auth integration and smart contracts.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ethers = require('ethers');

// ANSI Color codes for better visibility
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Log with colors
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Log successful check
function logSuccess(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

// Log warning
function logWarning(message) {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

// Log error
function logError(message) {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

// Log info
function logInfo(message) {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

// Header for sections
function logHeader(header) {
  console.log(`\n${colors.bright}${colors.cyan}=== ${header} ===${colors.reset}\n`);
}

// Start diagnostics
async function runDiagnostics() {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║        Web3Auth and Blockchain Integration Diagnostics     ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    // Check environment
    await checkEnvironment();
    
    // Check wallet/provider configuration
    await checkWalletConfiguration();
    
    // Check contracts
    await checkContracts();
    
    // Check network connectivity
    await checkNetworkConnectivity();
    
    // Provide recommendations
    provideRecommendations();
    
  } catch (error) {
    logError(`Diagnostics failed: ${error.message}`);
    console.error(error);
  }
}

// Check environment
async function checkEnvironment() {
  logHeader("Environment Check");
  
  // Check Node version
  try {
    const nodeVersion = process.version;
    log(`Node.js version: ${nodeVersion}`);
    const versionNum = nodeVersion.slice(1).split('.').map(Number);
    
    if (versionNum[0] < 16) {
      logWarning("Node.js version is below recommended v16+ for ethers.js v6");
    } else {
      logSuccess("Node.js version is compatible");
    }
  } catch (error) {
    logError(`Failed to check Node.js version: ${error.message}`);
  }
  
  // Check NPM version
  try {
    const npmVersion = execSync('npm -v').toString().trim();
    log(`npm version: ${npmVersion}`);
    const versionNum = npmVersion.split('.').map(Number);
    
    if (versionNum[0] < 7) {
      logWarning("npm version is below recommended v7+");
    } else {
      logSuccess("npm version is compatible");
    }
  } catch (error) {
    logError(`Failed to check npm version: ${error.message}`);
  }

  // Check for package.json
  try {
    if (fs.existsSync('./package.json')) {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      log(`Project: ${packageJson.name || 'Unnamed'} v${packageJson.version || 'unknown'}`);
      
      // Check for required dependencies
      const requiredDeps = [
        '@web3auth/modal',
        '@web3auth/base',
        'ethers'
      ];
      
      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );
      
      if (missingDeps.length > 0) {
        logWarning(`Missing dependencies: ${missingDeps.join(', ')}`);
      } else {
        logSuccess("All required dependencies are installed");
        
        // Log versions of key dependencies
        for (const dep of requiredDeps) {
          const version = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
          log(`${dep}: ${version}`, colors.dim);
        }
      }
    } else {
      logError("package.json not found. Make sure you're in the project root directory.");
    }
  } catch (error) {
    logError(`Failed to check package.json: ${error.message}`);
  }
}

// Check wallet configuration
async function checkWalletConfiguration() {
  logHeader("Wallet/Provider Configuration Check");
  
  // Check for Web3Auth configuration files
  try {
    const configFiles = [
      { path: './src/services/playground.tsx', name: 'Web3Auth Playground' },
      { path: './src/services/web3authContext.tsx', name: 'Web3Auth Context' },
      { path: './src/services/evmProvider.ts', name: 'EVM Provider' },
      { path: './src/services/walletProvider.ts', name: 'Wallet Provider' },
    ];
    
    let allFilesExist = true;
    
    for (const config of configFiles) {
      if (fs.existsSync(config.path)) {
        logSuccess(`${config.name} file found (${config.path})`);
        
        // Check content for common issues
        const content = fs.readFileSync(config.path, 'utf8');
        
        // Check for placeholder or missing clientId
        if (config.path.includes('web3authContext.tsx')) {
          if (content.includes('clientId: "YOUR_CLIENT_ID"') || 
              content.includes('clientId: ""') ||
              !content.includes('clientId:')) {
            logWarning(`${config.name} may have missing or placeholder clientId`);
          }
          
          // Check if chain configuration is present
          if (content.includes('chainConfig:')) {
            logSuccess("Chain configuration found");
            
            // Identify which chain is configured
            if (content.includes('chainNamespace: CHAIN_NAMESPACES.EIP155')) {
              logInfo("Using EVM compatible chain (EIP155)");
              
              if (content.includes('0x142d')) {
                logInfo("Using Bahamut blockchain (chainId: 0x142d)");
              }
            }
          } else {
            logWarning("Chain configuration might be missing");
          }
        }
        
        // Check for getEthersProvider function in evmProvider.ts
        if (config.path.includes('evmProvider.ts')) {
          if (content.includes('getEthersProvider') && content.includes('invalid EIP-1193 provider')) {
            logSuccess("Found provider validation in evmProvider.ts");
          } else {
            logWarning("Provider validation might be missing in evmProvider.ts");
            logInfo("This could cause 'invalid EIP-1193 provider' errors");
          }
          
          // Check for gasLimit settings
          if (content.includes('gasLimit:')) {
            logSuccess("Gas limit configuration found");
            
            // Check if gas limit is sufficient
            const gasLimitMatch = content.match(/gasLimit:\s*(\d+)/);
            if (gasLimitMatch) {
              const gasLimit = parseInt(gasLimitMatch[1]);
              log(`Gas limit: ${gasLimit}`, colors.dim);
              
              if (gasLimit < 100000) {
                logWarning(`Gas limit (${gasLimit}) might be too low, recommended 100000+`);
              } else {
                logSuccess(`Gas limit (${gasLimit}) is sufficient`);
              }
            }
          } else {
            logWarning("Gas limit configuration might be missing");
            logInfo("This could cause 'gas required exceeds allowance' errors");
          }
        }
      } else {
        logError(`${config.name} file not found (${config.path})`);
        allFilesExist = false;
      }
    }
    
    if (allFilesExist) {
      logSuccess("All required Web3Auth configuration files are present");
    }
  } catch (error) {
    logError(`Failed to check Web3Auth configuration: ${error.message}`);
  }
}

// Check contracts
async function checkContracts() {
  logHeader("Smart Contract Check");
  
  // Check for contract files
  try {
    // Check for ABI files
    const abiFiles = [
      { path: './src/config/ABI.json', name: 'Basic ABI' },
      { path: './src/config/TestEvaluatorABI.json', name: 'TestEvaluator ABI' },
    ];
    
    let foundAbiFiles = false;
    
    for (const abi of abiFiles) {
      if (fs.existsSync(abi.path)) {
        logSuccess(`${abi.name} file found (${abi.path})`);
        foundAbiFiles = true;
        
        // Validate ABI format
        try {
          const abiContent = JSON.parse(fs.readFileSync(abi.path, 'utf8'));
          if (Array.isArray(abiContent)) {
            logSuccess(`${abi.name} has valid JSON format`);
            log(`Contains ${abiContent.length} function/event definitions`, colors.dim);
            
            // Check for important functions in TestEvaluator
            if (abi.path.includes('TestEvaluatorABI')) {
              const functions = abiContent
                .filter(item => item.type === 'function' || !item.type)
                .map(item => item.name);
              
              log(`Functions: ${functions.join(', ')}`, colors.dim);
              
              const requiredFunctions = ['initializeTest', 'startTest', 'completeTest'];
              const missingFunctions = requiredFunctions.filter(fn => !functions.includes(fn));
              
              if (missingFunctions.length > 0) {
                logWarning(`TestEvaluator ABI is missing required functions: ${missingFunctions.join(', ')}`);
              } else {
                logSuccess("TestEvaluator ABI contains all required functions");
              }
            }
          } else {
            logError(`${abi.name} is not a valid ABI array`);
          }
        } catch (error) {
          logError(`Failed to parse ${abi.name}: ${error.message}`);
        }
      } else {
        logWarning(`${abi.name} file not found (${abi.path})`);
      }
    }
    
    if (!foundAbiFiles) {
      logError("No ABI files found. This is required for contract interaction.");
    }
    
    // Check for Solidity contract files
    const solFiles = glob('./src/**/*.sol');
    if (solFiles.length > 0) {
      logSuccess(`Found ${solFiles.length} Solidity contract files`);
      solFiles.forEach(file => log(`- ${file}`, colors.dim));
    } else {
      logWarning("No Solidity (.sol) contract files found");
    }
    
    // Check for bytecode file
    if (fs.existsSync('./bytecode.txt')) {
      logSuccess("Contract bytecode file found (bytecode.txt)");
      
      // Check bytecode format
      const bytecode = fs.readFileSync('./bytecode.txt', 'utf8').trim();
      if (bytecode.length > 0) {
        if (bytecode.startsWith('0x') || /^[0-9a-fA-F]+$/.test(bytecode)) {
          logSuccess("Bytecode format appears valid");
          log(`Bytecode length: ${bytecode.length} characters`, colors.dim);
        } else {
          logWarning("Bytecode format might be invalid");
        }
      } else {
        logError("Bytecode file is empty");
      }
    } else {
      logWarning("Contract bytecode file not found (bytecode.txt)");
    }
    
    // Check for contract helpers
    if (fs.existsSync('./src/services/testEvaluator.ts')) {
      logSuccess("TestEvaluator service file found");
      
      // Check content for common issues
      const content = fs.readFileSync('./src/services/testEvaluator.ts', 'utf8');
      
      // Check if contract address is hardcoded or dynamic
      if (content.includes('CONTRACT_ADDRESS = ""') || 
          content.includes('let CONTRACT_ADDRESS')) {
        logSuccess("Contract address is dynamic (good for deploying new contracts)");
      } else if (content.includes('CONTRACT_ADDRESS =')) {
        logInfo("Contract address appears to be hardcoded");
        
        // Extract hardcoded address
        const addressMatch = content.match(/CONTRACT_ADDRESS\s*=\s*["']([0-9a-fA-Fx]+)["']/);
        if (addressMatch) {
          log(`Hardcoded contract address: ${addressMatch[1]}`, colors.dim);
        }
      }
      
      // Check for deployment function
      if (content.includes('deployTestEvaluator')) {
        logSuccess("Contract deployment function found");
        
        // Check gas limit for deployment
        const deployGasMatch = content.match(/gasLimit:\s*(\d+)[^]*?deploy\(/);
        if (deployGasMatch) {
          const deployGas = parseInt(deployGasMatch[1]);
          log(`Deployment gas limit: ${deployGas}`, colors.dim);
          
          if (deployGas < 5000000) {
            logWarning(`Deployment gas limit (${deployGas}) might be too low, recommended 5000000+`);
          } else {
            logSuccess(`Deployment gas limit (${deployGas}) is sufficient`);
          }
        } else {
          logWarning("Could not determine deployment gas limit");
        }
      } else {
        logWarning("Contract deployment function might be missing");
      }
    } else {
      logWarning("TestEvaluator service file not found");
    }
  } catch (error) {
    logError(`Failed to check contract files: ${error.message}`);
  }
}

// Helper to find files with glob pattern
function glob(pattern) {
  const results = [];
  const segments = pattern.split('/');
  const isGlobPattern = (segment) => segment.includes('*');
  
  function scan(dir, segmentIndex) {
    if (segmentIndex >= segments.length) return;
    
    const segment = segments[segmentIndex];
    const isLast = segmentIndex === segments.length - 1;
    
    if (isGlobPattern(segment)) {
      const regex = new RegExp(`^${segment.replace(/\*/g, '.*')}$`);
      
      try {
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          const stats = fs.statSync(fullPath);
          
          if (regex.test(entry)) {
            if (isLast) {
              if (stats.isFile()) results.push(fullPath);
            } else if (stats.isDirectory()) {
              scan(fullPath, segmentIndex + 1);
            }
          } else if (stats.isDirectory() && segment === '**') {
            scan(fullPath, segmentIndex);  // stay at same segment for ** recursion
            scan(fullPath, segmentIndex + 1);  // move to next segment
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    } else {
      const nextDir = path.join(dir, segment);
      if (fs.existsSync(nextDir) && fs.statSync(nextDir).isDirectory()) {
        scan(nextDir, segmentIndex + 1);
      }
    }
  }
  
  scan('.', 0);
  return results;
}

// Check network connectivity
async function checkNetworkConnectivity() {
  logHeader("Network Connectivity Check");
  
  // Check for chain configuration
  try {
    if (fs.existsSync('./src/config/chainConfig.ts')) {
      logSuccess("Chain configuration file found");
      
      // Check content for chain details
      const content = fs.readFileSync('./src/config/chainConfig.ts', 'utf8');
      
      // Check which chains are configured
      if (content.includes('chainId: "0x142d"') || content.includes('chainId: 0x142d')) {
        logSuccess("Bahamut chain configuration found (chainId: 0x142d)");
        
        // Check if RPC URL is configured
        const rpcMatch = content.match(/rpcTarget:\s*["']([^"']+)["']/);
        if (rpcMatch) {
          const rpcUrl = rpcMatch[1];
          log(`RPC URL: ${rpcUrl}`, colors.dim);
          
          // Test RPC connection
          try {
            logInfo("Testing RPC connection (this may take a few seconds)...");
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const networkInfo = await provider.getNetwork();
            
            logSuccess(`Successfully connected to network: Chain ID ${networkInfo.chainId}`);
            
            // Get additional network info
            try {
              const blockNumber = await provider.getBlockNumber();
              log(`Current block number: ${blockNumber}`, colors.dim);
              
              const gasPrice = await provider.getFeeData();
              log(`Gas price: ${ethers.formatUnits(gasPrice.gasPrice || 0n, 'gwei')} Gwei`, colors.dim);
            } catch (error) {
              logWarning(`Could not get additional network info: ${error.message}`);
            }
          } catch (error) {
            logError(`Failed to connect to RPC: ${error.message}`);
            logError("This may indicate network connectivity issues or an invalid RPC URL");
          }
        } else {
          logWarning("Could not determine RPC URL from configuration");
        }
      } else {
        logWarning("Bahamut chain configuration not found");
      }
    } else {
      logWarning("Chain configuration file not found");
    }
  } catch (error) {
    logError(`Failed to check chain configuration: ${error.message}`);
  }
}

// Provide recommendations based on findings
function provideRecommendations() {
  logHeader("Recommendations and Next Steps");
  
  log("Based on the diagnostics, here are some recommended actions:", colors.bright);
  log("");
  
  log("1. If you're seeing 'Provider not available' errors:", colors.bright);
  log("   - Make sure you're properly connecting with Web3Auth before trying to use the provider");
  log("   - Check the browser console for additional error messages");
  log("   - Verify that your Web3Auth clientId is correct and not a placeholder");
  log("");
  
  log("2. If contract deployment fails:", colors.bright);
  log("   - Ensure you're connected to the correct network (Bahamut)");
  log("   - Check that your wallet has sufficient funds for deployment");
  log("   - Try increasing the gas limit for deployment (6-10 million gas)");
  log("   - Verify that the bytecode is correctly formatted");
  log("");
  
  log("3. If transaction signing fails:", colors.bright);
  log("   - Check the console for detailed error messages");
  log("   - Increase the gas limit for transactions (at least 100,000 gas)");
  log("   - Verify that you have enough tokens for gas fees");
  log("");
  
  log("4. For continued issues:", colors.bright);
  log("   - Check the Web3Auth documentation: https://web3auth.io/docs/");
  log("   - Review the Ethers.js documentation: https://docs.ethers.org/");
  log("   - Verify that the Bahamut RPC endpoint is functioning correctly");
  log("");
  
  log("5. Common Error Codes:", colors.bright);
  log("   - Invalid EIP-1193 provider: The provider is null or incorrect format");
  log("   - Gas required exceeds allowance: Increase gas limit for the transaction");
  log("   - User rejected request: The user declined to sign the transaction");
  log("   - Insufficient funds: Add more tokens to your wallet for gas fees");
  log("");
  
  log(`${colors.cyan}Add this to your Ethers provider initialization in evmProvider.ts:${colors.reset}`);
  log(`
  // Helper function to validate provider before using it
  const getEthersProvider = () => {
    if (!provider) {
      throw new Error("Provider is null or undefined");
    }
    try {
      return new ethers.BrowserProvider(provider as any);
    } catch (error: any) {
      uiConsole("Error creating BrowserProvider:", error);
      throw new Error("invalid EIP-1193 provider");
    }
  };
  `);
  
  log("");
  log(`${colors.cyan}For the gas limit issue, ensure you have this in your transaction code:${colors.reset}`);
  log(`
  // Submit transaction to the blockchain
  const tx = await signer.sendTransaction({
    to: destination,
    value: amountBigInt,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? ethers.parseUnits("1", "gwei"),
    maxFeePerGas: feeData.maxFeePerGas ?? ethers.parseUnits("5", "gwei"),
    gasLimit: 100000,  // Important: High enough gas limit
  });
  `);
}

// Run the diagnostics
runDiagnostics().then(() => {
  console.log(`\n${colors.bright}${colors.green}Diagnostics completed!${colors.reset}\n`);
});