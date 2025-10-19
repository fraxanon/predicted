const { ethers } = require('hardhat');
const { formatEther, parseEther } = require('ethers');

async function main() {
  console.log('🔥 Deploying Predicted Market Factory to Fraxtal...');
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  
  // Get balance using provider
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', formatEther(balance), 'frxETH');

  // Fraxtal configuration
  const network = await ethers.provider.getNetwork();
  const isTestnet = network.chainId === 2522;
  
  // Use mock address for testnet, real address for mainnet
  const FRXUSD_ADDRESS = isTestnet 
    ? '0x0000000000000000000000000000000000000001' // Mock frxUSD for testnet
    : '0xfc00000000000000000000000000000000000001'; // Real frxUSD on mainnet
    
  const MARKET_CREATION_FEE = parseEther('0.01'); // 0.01 frxETH
  const TRADING_FEE_BPS = 200; // 2%

  // Deploy the SimpleMarketFactory contract (for testing)
  console.log('\n📋 Deploying SimpleMarketFactory...');
  const SimpleMarketFactory = await ethers.getContractFactory('SimpleMarketFactory');
  const marketFactory = await SimpleMarketFactory.deploy(
    MARKET_CREATION_FEE,
    TRADING_FEE_BPS
  );

  await marketFactory.deployed();
  console.log('✅ SimpleMarketFactory deployed to:', marketFactory.address);

  // Verify deployment
  console.log('\n🔍 Verifying deployment...');
  const creationFee = await marketFactory.marketCreationFee();
  const tradingFee = await marketFactory.tradingFeeBps();
  const owner = await marketFactory.owner();
  
  console.log('Creation Fee:', formatEther(creationFee), 'frxETH');
  console.log('Trading Fee:', tradingFee.toString(), 'bps');
  console.log('Owner:', owner);
  console.log('Network:', isTestnet ? 'Fraxtal Testnet' : 'Fraxtal Mainnet');

  // Save deployment info
  const deploymentInfo = {
    network: isTestnet ? 'fraxtal-testnet' : 'fraxtal',
    chainId: network.chainId,
    contracts: {
      SimpleMarketFactory: {
        address: marketFactory.address,
        deployer: deployer.address,
        deploymentBlock: marketFactory.deployTransaction.blockNumber,
        txHash: marketFactory.deployTransaction.hash
      }
    },
    config: {
      marketCreationFee: MARKET_CREATION_FEE.toString(),
      tradingFeeBps: TRADING_FEE_BPS
    },
    timestamp: new Date().toISOString()
  };

  // Write to file
  const fs = require('fs');
  fs.writeFileSync(
    './deployments/fraxtal.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('\n🎉 Deployment complete!');
  console.log('📄 Deployment info saved to: ./deployments/fraxtal.json');
  console.log('\n📋 Contract Addresses:');
  console.log('PredictedMarketFactory:', marketFactory.address);
  console.log('\n🔗 Fraxscan:', `https://fraxscan.com/address/${marketFactory.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
