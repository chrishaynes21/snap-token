pragma solidity ^0.5.2;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";



/**
 * @title SnapToken
 * @dev Our ERC20 Token will be minted each month giving users their allowance. When vendors return their collected tokens
 *      in exchange for Ethereum, we will burn those returned.
 */
contract SnapToken is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(DECIMALS));
    //keep list of vendors
    //keep list of users
    //keep list of allowances

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed("SnapToken", "SNAP", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    //mint function for admin
        //transfer allowances monthly
    
    //transfer users to vendors
    
    //vendor transfer to us
        //burn the SnapToken?
        
    //get balance functions for users and vendors
    

}

