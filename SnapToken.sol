pragma solidity ^0.5.2;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";


/**
 * @title SnapToken
 * @dev Our ERC20 Token will be minted each month giving users their allowance. When vendors return their collected tokens
 *      in exchange for Ethereum, we will burn those returned.
 */
contract SnapToken is IERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(DECIMALS));
    
    mapping (string => address) vendors; //keep list of vendors
    mapping (string => address) members; //keep list of SNAP beneficiaries
    mapping (address => uint256) allowances; //keep list of allowances (only members)
    mapping (address => uint256) balance; //keep list of balances (vendors and members)
    address owner;
    string[] memberNames;
    string[] vendorNames;

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed("SnapToken", "SNAP", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
        owner = msg.sender;
    }
    
    //mint function for admin
    function mint(address to, uint256 value) public returns (bool) {
        require(msg.sender == owner);
        _mint(to, value);
        return true;
    }
    //transfer allowances monthly
    function giveAllowances() public returns (bool) {
        require(msg.sender == owner);
        for(uint i = 0; i < memberNames.length; i++) { //loop through members
            address tempMemberAddress = members[memberNames[i]];
            _mint(tempMemberAddress, allowances[tempMemberAddress]);
        }
        return true;
    }
    
    //transfer users to vendors
    function useSnap(string memory me, string memory vendorName, uint256 amount) public returns (bool) {
        require(vendors[vendorName] != address(0)); //require vendor inside vendors mapping
        require(members[me] == msg.sender); //only members can use this function
        require(balance[msg.sender] >= amount); //need to worry about gas?
        SafeERC20.safeTransferFrom(SnapToken, msg.sender, vendors[vendorName], amount); //member to vendor transfer
        //update balances?
            //member and the vendor
    }
    
    //vendor transfer to us
    function exchangeSnap(string memory me, address to, uint256 amount) public returns (bool) {
        require(to == owner);
        require(vendors[me] == msg.sender); //only vendors can use this function
        require(balance[msg.sender] >= amount); //gas?
        SafeERC20.safeTransferFrom("SnapToken", msg.sender, to, amount); //safeTransfer amount to owner
            //burn the SnapToken?
        //give eth back?
    }
        
    //get balance functions for members and vendors
    function getBalance() public view {
        return balance[msg.sender];
    }
    
    
    
    
    
}

