pragma solidity 0.6.2;

import "./Ownable.sol";

/// @title Upgradeable contract
/// @author Anton Grigorev (@BaldyAsh)
contract Upgradeable is Ownable {
    /// @notice Storage position of the current implementation address
    bytes32 private constant implementationPosition = keccak256("implementation");

    /// @notice Contract constructor
    /// @dev Calls Ownable contract constructor
    constructor() Ownable() public {}

    /// @notice Returns current implementation of contract
    /// @return Implementaion address
    function getImplementation() public view returns (address implementation) {
        bytes32 position = implementationPosition;
        assembly {
            implementation := sload(position)
        }
    }
    
    /// @notice Sets new implementation of contract as current
    /// @param _newImplementation New contract implementation address
    function setImplementation(address _newImplementation) public {
        requireOwner();
        require(
            _newImplementation != address(0),
            "d784d42601"
        ); // d784d42601 - new implementation must have non-zero address
        address currentImplementation = getImplementation();
        require(
            currentImplementation != _newImplementation,
            "d784d42602"
        ); // d784d42602 - new implementation must have new address
        bytes32 position = implementationPosition;
        assembly {
            sstore(position, _newImplementation)
        }
    }
    
    /// @notice Sets new implementation and call new implementation to initialize what is needed on it
    /// @dev New implementation call is a low level delegatecall
    /// @param _newImplementation representing the address of the new implementation to be set.
    /// @param _newImplementaionCallData represents the msg.data to bet sent in the low level call. This parameter may include the function
    /// signature of the implementation to be called with the needed payload
    function setImplementationAndCall(address _newImplementation, bytes calldata _newImplementaionCallData) external payable {
        setImplementation(_newImplementation);
        if (_newImplementaionCallData.length > 0) {
            (bool success, ) = address(this).call.value(msg.value)(_newImplementaionCallData);
            require(
                success,
                "e9c8588d01"
            ); // e9c8588d01 - something goes wrong in call
        }
    }
}