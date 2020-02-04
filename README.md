# Proxy Contracts Solidity

Solidity proxy contracts based on unstructured storage pattern. Upgrade your contracts safely.

Read more about proxy patterns from [OpenZeppelin article](https://blog.openzeppelin.com/proxy-patterns/).

I chose this pattern for implementation because it is the most convenient in its further support. So, no implementation of a proxied contract should know about the proxy contract storage structure. However, all implementations must inherit all of the storage variables that were declared in their ancestors.

The address of the current implementation is stored in a constant pseudorandom slot of the contract proxy contract (slot number obtained as a result of hashing a certain message), the probability of rewriting which is almost zero.

If you want to set the initial implementation state, use a separate initialize function for it, which will essentially be the "constructor" of the contract. This is due to the fact that the proxy does not reflect in any way the changes that you make in the constructor of the contract, therefore it can be considered useless.

When creating a contract, the sender of this transaction will be assigned as its owner. The address of the owner is stored in a manner similar to the implementation address.

You can change the owner using the following function:
```solidity
/// @notice The owner can transfer control of the contract to the new owner
/// @param _newOwner New proxy owner
function transferOwnership(address _newOwner) external
```

You can change current implementation after its deployment using the following function:
```solidity
/// @notice Sets new implementation of contract as current
/// @param _newImplementation New contract implementation address
function setImplementation(address _newImplementation) public
```
Or if you want to set some initial state for it use the following function:
```solidity
/// @notice Sets new implementation and call new implementation to initialize what is needed on it
/// @dev New implementation call is a low level delegatecall
/// @param _newImplementation representing the address of the new implementation to be set.
/// @param _newImplementaionCallData represents the msg.data to bet sent in the low level call. This parameter may include the function
/// signature of the implementation to be called with the needed payload
function setImplementationAndCall(address _newImplementation, bytes calldata _newImplementaionCallData) external payable
```

You can use any function of the implementation contract as usual, however, the address should be the address of its proxy contract. This is because the implementation functions will be called using the delegate call from the context of the proxy contract using the fallback function.

## Install and use

### Copy/paste

Just copy .sol files from contracts folder and use them with your contracts

### Yarn

1. Install [node.js](https://nodejs.org/en/download/) and [yarn](https://yarnpkg.com/getting-started/install) if you haven't yet
2. Install package
```sh
yarn add upgradeable-contracts-solidity
```
3. There are 2 ways
    1. Deploy proxy using bytecode from this file:
      ```sh
      ../node_modules/upgradeable-contracts-solidity/build/Proxy.json
      ```
    2. Import Proxy.sol into your NewProxy.sol file, inherit from Proxy contract, save and deploy it. Feel free to add your functionality (DO NOT add storage variables if you don't completely understand how it works) 
    ```solidity
    pragma solidity ^0.5.0;

    import "../node_modules/upgradeable-contracts-solidity/contracts/Proxy.sol";

    contract YoursContract is Proxy {}
    ```
4. Deploy and set implementation as described above

## Build and test
1. Install [node.js](https://nodejs.org/en/download/) and [yarn](https://yarnpkg.com/getting-started/install) if you haven't yet
2. Clone repo
```sh
git clone https://github.com/BaldyAsh/upgradeable-contracts-solidity
```
3. Go to downloaded folder and install dependencies
```sh
yarn
```
4. Compile contracts and run tests
```sh
yarn test
```

## Credits

Anton Grigorev, [@baldyash](https://github.com/BaldyAsh)

## Contribute

- If you **need help**, [open an issue](https://github.com/BaldyAsh/upgradeable-contracts-solidity/issues).
- If you **found a bug or security vulnerability**, [open an issue](https://github.com/BaldyAsh/upgradeable-contracts-solidity/issues).
- If you **have a feature request**, [open an issue](https://github.com/BaldyAsh/upgradeable-contracts-solidity/issues).
- If you **want to contribute**, [submit a pull request](https://github.com/BaldyAsh/upgradeable-contracts-solidity/pulls).
- Donations on my Ether wallet address: 0x4fd693F57e63714591A07A73A4D7AD84e5cCdE10

![Donate](http://qrcoder.ru/code/?0x4fd693F57e63714591A07A73A4D7AD84e5cCdE10&4&0)

## License

This project is available under the MIT license. See the [LICENSE](https://github.com/BaldyAsh/upgradeable-contracts-solidity/blob/master/LICENSE) for details.
