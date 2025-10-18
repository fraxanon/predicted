const { ethers } = require('hardhat');

async function main() {
  console.log('🔥 Deploying Predicted Market Factory to Fraxtal...');
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  // Fraxtal configuration
  const FRXUSD_ADDRESS = '0xfc00000000000000000000000000000000000001'; // Native frxUSD on Fraxtal
  const MARKET_CREATION_FEE = ethers.utils.parseEther('0.01'); // 0.01 frxETH
  const TRADING_FEE_BPS = 200; // 2%

  // Deploy the PredictedMarketFactory contract
  console.log('\n📋 Deploying PredictedMarketFactory...');
  const PredictedMarketFactory = await ethers.getContractFactory('PredictedMarketFactory');
  const marketFactory = await PredictedMarketFactory.deploy(
    FRXUSD_ADDRESS,
    MARKET_CREATION_FEE,
    TRADING_FEE_BPS
  );

  await marketFactory.deployed();
  console.log('✅ PredictedMarketFactory deployed to:', marketFactory.address);

  // Verify deployment
  console.log('\n🔍 Verifying deployment...');
  const creationFee = await marketFactory.marketCreationFee();
  const tradingFee = await marketFactory.tradingFeeBps();
  const frxUSD = await marketFactory.frxUSD();
  
  console.log('Creation Fee:', ethers.utils.formatEther(creationFee), 'frxETH');
  console.log('Trading Fee:', tradingFee.toString(), 'bps');
  console.log('frxUSD Address:', frxUSD);

  // Save deployment info
  const deploymentInfo = {
    network: 'fraxtal',
    chainId: 252,
    contracts: {
      PredictedMarketFactory: {
        address: marketFactory.address,
        deployer: deployer.address,
        deploymentBlock: marketFactory.deployTransaction.blockNumber,
        txHash: marketFactory.deployTransaction.hash
      }
    },
    config: {
      frxUSD: FRXUSD_ADDRESS,
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
