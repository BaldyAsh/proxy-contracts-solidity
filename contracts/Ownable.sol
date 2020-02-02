pragma solidity 0.6.2;

/// @title Ownable Contract
/// @author Anton Grigorev (@BaldyAsh)
contract Ownable {
    /// @notice Storage position of the owner address
    bytes32 private constant ownerPosition = keccak256("owner");
    
    /// @notice Contract constructor
    /// @dev Sets msg sender address as owner address
    constructor() public {
        setOwner(msg.sender);
    }
    
    /// @notice Requires owner to be msg sender
    function requireOwner() internal view {
        require(
            msg.sender == getOwner(),
            "55f1136901"
        ); // 55f1136901 - sender must be owner
    }
    
    /// @notice Returns contract owner address
    /// @return Owner address
    function getOwner() public view returns (address owner) {
        bytes32 position = ownerPosition;
        assembly {
            owner := sload(position)
        }
    }
    
    /// @notice Sets new owner address
    /// @param _newOwner New owner address
    function setOwner(address _newOwner) internal {
        bytes32 position = ownerPosition;
        assembly {
            sstore(position, _newOwner)
        }
    }
    
    /// @notice The owner can transfer controll of the contract to new owner
    /// @param _newOwner New proxy owner
    function transferOwnership(address _newOwner) external {
        requireOwner();
        require(
            _newOwner != address(0),
            "f2fde38b01"
        ); // f2fde38b01 - new owner cant be zero address
        setOwner(_newOwner);
    }
}