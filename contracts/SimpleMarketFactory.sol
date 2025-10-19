// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimpleMarketFactory
 * @dev Simplified prediction market factory for testing on Fraxtal
 */
contract SimpleMarketFactory {
    
    // Market creation fee in wei
    uint256 public marketCreationFee;
    
    // Trading fee in basis points (100 = 1%)
    uint256 public tradingFeeBps;
    
    // Counter for market IDs
    uint256 public nextMarketId;
    
    // Owner of the contract
    address public owner;
    
    struct Market {
        uint256 id;
        string question;
        string category;
        address creator;
        uint256 endTime;
        uint256 createdAt;
        bool resolved;
        uint256 outcome; // 0 = NO, 1 = YES
        uint256 totalVolume;
    }
    
    // Market ID => Market data
    mapping(uint256 => Market) public markets;
    
    // Events
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        address indexed creator,
        uint256 endTime
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        uint256 outcome
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(
        uint256 _marketCreationFee,
        uint256 _tradingFeeBps
    ) {
        owner = msg.sender;
        marketCreationFee = _marketCreationFee;
        tradingFeeBps = _tradingFeeBps;
        nextMarketId = 1;
    }
    
    /**
     * @dev Create a new prediction market
     */
    function createMarket(
        string calldata question,
        string calldata category,
        uint256 endTime
    ) external payable returns (uint256) {
        require(msg.value >= marketCreationFee, "Insufficient creation fee");
        require(endTime > block.timestamp + 1 hours, "End time too soon");
        require(endTime < block.timestamp + 365 days, "End time too far");
        require(bytes(question).length > 0, "Question required");
        
        uint256 marketId = nextMarketId++;
        
        markets[marketId] = Market({
            id: marketId,
            question: question,
            category: category,
            creator: msg.sender,
            endTime: endTime,
            createdAt: block.timestamp,
            resolved: false,
            outcome: 0,
            totalVolume: 0
        });
        
        emit MarketCreated(marketId, question, msg.sender, endTime);
        
        return marketId;
    }
    
    /**
     * @dev Resolve a market (only owner for now)
     */
    function resolveMarket(
        uint256 marketId,
        uint256 outcome
    ) external onlyOwner {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market does not exist");
        require(!market.resolved, "Already resolved");
        require(block.timestamp >= market.endTime, "Market not ended");
        require(outcome <= 1, "Invalid outcome");
        
        market.resolved = true;
        market.outcome = outcome;
        
        emit MarketResolved(marketId, outcome);
    }
    
    /**
     * @dev Get market details
     */
    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }
    
    /**
     * @dev Update market creation fee (only owner)
     */
    function setMarketCreationFee(uint256 _fee) external onlyOwner {
        marketCreationFee = _fee;
    }
    
    /**
     * @dev Update trading fee (only owner)
     */
    function setTradingFeeBps(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 1000, "Fee too high"); // Max 10%
        tradingFeeBps = _feeBps;
    }
    
    /**
     * @dev Withdraw collected fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        payable(owner).transfer(balance);
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
