pragma solidity ^0.5.7;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

/**
 * @title SnapToken
 * @dev Our ERC20 Token will be minted each month giving users their allowance. When vendors return their collected tokens
 *      in exchange for Ethereum, we will burn those returned.
 */
contract SnapToken is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable, usingOraclize {
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 0 * (10 ** uint256(DECIMALS));
    
    mapping (string => address) public vendors; //keep list of vendors
    mapping (string => address) public members; //keep list of SNAP beneficiaries
    mapping (address => uint256) public allowances; //keep list of allowances (only members)
    address public owner;
    string[] public memberNames;
    string[] public vendorNames;
    
    uint256 public etherPrice = 150;
    uint256 public transferAmount;
    
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed("SnapToken", "SNAP", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
        owner = msg.sender;
        updatePrice(); //fill ether price when contract is deployed
        
        //remove after testing
        addMember("Paul", 0x2d03e08DEf83B3440F7AACA1706308D2D7B550b8, 350);
        addMember("Dennis", 0xE053D3F71A65344357F8300CBB48163b7F862505, 400);
        addVendor("King Soopers", 0x19edA1943E6835Cd4723E1d350096E87D538ab2b);
    }
    
    
    //transfer allowances monthly
    function giveAllowances() payable public returns (bool) {
        require(msg.sender == owner);
        uint256 sum = 0;
        for(uint i = 0; i < memberNames.length; i++) { //loop through members
            address tempMemberAddress = members[memberNames[i]];
            _mint(tempMemberAddress, allowances[tempMemberAddress]);
            sum += allowances[tempMemberAddress];
        }
        uint256 requiredEther = sum/etherPrice;
        //owner add allowances/etherPrice to contact balance
        require(msg.value >= requiredEther); //automatically sends ether to contract
        return true;
    }
    
    //transfer users to vendors
    function useSnap(string memory me, string memory vendorName, uint256 amount) public returns (bool) {
        require(vendors[vendorName] != address(0)); //require vendor inside vendors mapping
        require(members[me] == msg.sender); //only members can use this function
        require(balanceOf(msg.sender) >= amount); 
        _transfer(msg.sender, vendors[vendorName], amount); //member to vendor transfer
    }
    
    //vendor transfer to us
    function exchangeSnap(string memory me, uint256 amount) public returns (uint256) {
        require(vendors[me] == msg.sender); //only vendors can use this function
        require(balanceOf(msg.sender) >= amount);
        updatePrice(); 
        uint256 etherAmount = (amount * 10**18)/etherPrice; //problem of sending old amount?
        transferAmount = etherAmount;
        
        //no require contract balance as getAllowances forces contract to have
        //ether backing up snapTokens
        msg.sender.transfer(transferAmount);
        _burn(msg.sender, amount); //burn from contract not owner
            
        return etherAmount;
    }
        
    //get balance functions for members and vendors
    function getBalance() public view returns(uint256) {
        return balanceOf(msg.sender);
    }
    
    //getters
    function getEtherPrice() public view returns(uint256) {
        return etherPrice;
    }
    
    function getTransferAmount() public view returns(uint256) {
        return transferAmount;
    }
    
    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }
    
    function getRequiredEther() public view returns(uint256) {
        uint256 sum = 0;
        for(uint i = 0; i < memberNames.length; i++) { //loop through members
            address tempMemberAddress = members[memberNames[i]];
            sum += allowances[tempMemberAddress];
        }
        uint256 requiredEther = (sum * 10**18)/etherPrice;
        return requiredEther;
    }
    
    //add users
    function addMember(string memory newName, address newAddress, uint256 newAllowance) public {
        require(owner == msg.sender); //only owner can add new SNAP members
        require(members[newName] == address(0)); //only unique names allowed
        memberNames.push(newName);
        members[newName] = newAddress;
        allowances[newAddress] = newAllowance;
    }
    
    function addVendor(string memory newVendor, address newAddress) public {
        require(owner == msg.sender); //only owner can add new vendors
        require(vendors[newVendor] == address(0)); //only unique names allowed
        vendorNames.push(newVendor);
        vendors[newVendor] = newAddress;
    }
    
    //get current ether value via oraclize
    function updatePrice() public returns(uint256) {
        bytes32 queryID = oraclize_query("URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price");
    }
   
   function __callback(bytes32 myid, string memory result) public {
        require(msg.sender == oraclize_cbAddress(), "msg.sender is not Oraclize");
        //update ether price
        etherPrice = parseInt(result);
    }
    
    
}

