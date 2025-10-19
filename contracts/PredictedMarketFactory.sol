// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Simple implementations for testing - in production use OpenZeppelin
contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

library SafeERC20 {
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        require(token.transfer(to, value), "SafeERC20: transfer failed");
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        require(token.transferFrom(from, to, value), "SafeERC20: transferFrom failed");
    }
}

/**
 * @title PredictedMarketFactory
 * @dev Factory contract for creating prediction markets on Fraxtal
 * Uses Conditional Tokens Framework (CTF) architecture inspired by Polymarket
 */
contract PredictedMarketFactory is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // frxUSD token contract
    IERC20 public immutable frxUSD;
    
    // Market creation fee in frxETH
    uint256 public marketCreationFee;
    
    // Trading fee in basis points (100 = 1%)
    uint256 public tradingFeeBps;
    
    // Counter for market IDs
    uint256 public nextMarketId;
    
    struct Market {
        uint256 id;
        string question;
        string description;
        string category;
        address creator;
        address oracle;
        uint256 endTime;
        uint256 createdAt;
        uint256 creationFee;
        bool resolved;
        uint256 outcome; // 0 = NO, 1 = YES
        uint256 totalVolume;
        uint256 yesShares;
        uint256 noShares;
    }
    
    // Market ID => Market data
    mapping(uint256 => Market) public markets;
    
    // User => Market ID => Share balance (0 = NO shares, 1 = YES shares)
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public userShares;
    
    // Market ID => Total frxUSD locked
    mapping(uint256 => uint256) public marketLiquidity;
    
    // Events
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        address indexed creator,
        address indexed oracle,
        uint256 endTime
    );
    
    event SharesPurchased(
        uint256 indexed marketId,
        address indexed buyer,
        uint256 outcome,
        uint256 shares,
        uint256 cost
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        uint256 outcome,
        address indexed oracle
    );
    
    event WinningsRedeemed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );
    
    constructor(
        address _frxUSD,
        uint256 _marketCreationFee,
        uint256 _tradingFeeBps
    ) {
        frxUSD = IERC20(_frxUSD);
        marketCreationFee = _marketCreationFee;
        tradingFeeBps = _tradingFeeBps;
        nextMarketId = 1;
    }
    
    /**
     * @dev Create a new prediction market
     */
    function createMarket(
        string calldata question,
        string calldata description,
        string calldata category,
        address oracle,
        uint256 endTime
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= marketCreationFee, "Insufficient creation fee");
        require(endTime > block.timestamp + 1 hours, "End time too soon");
        require(endTime < block.timestamp + 365 days, "End time too far");
        require(oracle != address(0), "Invalid oracle address");
        require(bytes(question).length > 0, "Question required");
        
        uint256 marketId = nextMarketId++;
        
        markets[marketId] = Market({
            id: marketId,
            question: question,
            description: description,
            category: category,
            creator: msg.sender,
            oracle: oracle,
            endTime: endTime,
            createdAt: block.timestamp,
            creationFee: msg.value,
            resolved: false,
            outcome: 0,
            totalVolume: 0,
            yesShares: 0,
            noShares: 0
        });
        
        emit MarketCreated(marketId, question, msg.sender, oracle, endTime);
        
        return marketId;
    }
    
    /**
     * @dev Buy shares in a market (0 = NO, 1 = YES)
     */
    function buyShares(
        uint256 marketId,
        uint256 outcome,
        uint256 amount
    ) external nonReentrant {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.endTime, "Market ended");
        require(outcome <= 1, "Invalid outcome");
        require(amount > 0, "Amount must be positive");
        
        // Calculate cost (simplified pricing - can be enhanced with AMM)
        uint256 cost = amount; // 1:1 for now
        uint256 fee = (cost * tradingFeeBps) / 10000;
        uint256 totalCost = cost + fee;
        
        // Transfer frxUSD from user
        frxUSD.safeTransferFrom(msg.sender, address(this), totalCost);
        
        // Update user shares
        userShares[msg.sender][marketId][outcome] += amount;
        
        // Update market stats
        if (outcome == 0) {
            market.noShares += amount;
        } else {
            market.yesShares += amount;
        }
        
        market.totalVolume += cost;
        marketLiquidity[marketId] += cost;
        
        emit SharesPurchased(marketId, msg.sender, outcome, amount, totalCost);
    }
    
    /**
     * @dev Resolve a market (only oracle can call)
     */
    function resolveMarket(
        uint256 marketId,
        uint256 outcome
    ) external {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market does not exist");
        require(msg.sender == market.oracle, "Only oracle can resolve");
        require(!market.resolved, "Already resolved");
        require(block.timestamp >= market.endTime, "Market not ended");
        require(outcome <= 1, "Invalid outcome");
        
        market.resolved = true;
        market.outcome = outcome;
        
        emit MarketResolved(marketId, outcome, msg.sender);
    }
    
    /**
     * @dev Redeem winnings for resolved market
     */
    function redeemWinnings(uint256 marketId) external nonReentrant {
        Market storage market = markets[marketId];
        require(market.resolved, "Market not resolved");
        
        uint256 winningShares = userShares[msg.sender][marketId][market.outcome];
        require(winningShares > 0, "No winning shares");
        
        // Calculate payout
        uint256 totalWinningShares = market.outcome == 0 ? market.noShares : market.yesShares;
        uint256 payout = (marketLiquidity[marketId] * winningShares) / totalWinningShares;
        
        // Reset user shares
        userShares[msg.sender][marketId][market.outcome] = 0;
        
        // Transfer payout
        frxUSD.safeTransfer(msg.sender, payout);
        
        emit WinningsRedeemed(marketId, msg.sender, payout);
    }
    
    /**
     * @dev Get market details
     */
    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }
    
    /**
     * @dev Get user shares for a market
     */
    function getUserShares(
        address user,
        uint256 marketId
    ) external view returns (uint256 noShares, uint256 yesShares) {
        noShares = userShares[user][marketId][0];
        yesShares = userShares[user][marketId][1];
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
        
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Emergency withdraw frxUSD (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = frxUSD.balanceOf(address(this));
        frxUSD.safeTransfer(owner(), balance);
    }
}
