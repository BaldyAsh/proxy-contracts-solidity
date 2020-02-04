require('dotenv').config()
const {use, expect} = require('chai')
const {MockProvider, deployContract, solidity} = require('ethereum-waffle')
const ethers = require('ethers')

use(solidity)

const getCalldata = require('./helpers/getCalldata')

const TEST_CONTRACT_1 = require('../build/TestContract1')
const TEST_CONTRACT_2 = require('../build/TestContract2')
const PROXY = require('../build/Proxy')

describe('Tests', () => {
    const [wallet, walletTo] = new MockProvider().getWallets()
    let proxy

    beforeEach(async () => {
        proxy = await deployContract(wallet, PROXY, [])
    })

    describe('Ownership', () => {
        it('Get owner', async () => {
            expect(await proxy.getOwner()).to.eq(wallet.address)
        })

        it('Transfer ownership to zero address', async () => {
            const zero = ethers.constants.AddressZero
            await expect(proxy.transferOwnership(zero)).to.be.reverted
        })

        it('Transfer ownership to non-zero address', async () => {
            await proxy.transferOwnership(walletTo.address)
            expect(await proxy.getOwner()).to.eq(walletTo.address)
        })
    })

    describe('Upgrade', () => {
        let contract1
        let contract2

        beforeEach(async () => {
            contract1 = await deployContract(wallet, TEST_CONTRACT_1, [])
            contract2 = await deployContract(wallet, TEST_CONTRACT_2, [])
        })

        it('Wrong owner', async () => {
            const calldata = getCalldata('initialize', ['uint256'], [17])
            const proxyWithWrongSigner = proxy.connect(walletTo);
            await expect(proxyWithWrongSigner.setImplementationAndCall(contract1.address, calldata)).to.be.reverted
        })

        it('Old implementaton', async () => {
            const calldata = getCalldata('initialize', ['uint256'], [17])
            await proxy.setImplementationAndCall(contract1.address, calldata)
            expect(await proxy.getImplementation()).to.be.equal(contract1.address)
            await expect(proxy.setImplementation(contract1.address)).to.be.reverted
        })

        it('Wrong calldata', async () => {
            const calldata = getCalldata('initialize', ['address'], [ethers.constants.AddressZero])
            await expect(proxy.setImplementationAndCall(contract1.address, calldata)).to.be.reverted
        })

        it('Reinitialize must revert', async () => {
            const oldCalldata = getCalldata('initialize', ['uint256'], [17])
            await proxy.setImplementationAndCall(contract1.address, oldCalldata)
            expect(await proxy.getImplementation()).to.be.equal(contract1.address)
            const newCalldata = getCalldata('initialize', ['uint256'], [1])
            await expect(proxy.setImplementationAndCall(contract2.address, newCalldata)).to.be.reverted
        })
    })
    
    describe('Storage', () => {
        let contract1
        let contract2

        beforeEach(async () => {
            contract1 = await deployContract(wallet, TEST_CONTRACT_1, [])
            contract2 = await deployContract(wallet, TEST_CONTRACT_2, [])
        })

        it('Storage is saved after upgrade', async () => {
            const value = 17
            const calldata = getCalldata('initialize', ['uint256'], [value])
            await proxy.setImplementationAndCall(contract1.address, calldata)
            expect(await proxy.getImplementation()).to.be.equal(contract1.address)

            const implementationOld = new ethers.Contract(proxy.address, TEST_CONTRACT_1.interface, wallet)
            expect(await implementationOld.testAddress()).to.be.equal(proxy.address)
            expect(await implementationOld.testUInt()).to.be.equal(17)
            expect(await implementationOld.testMapping(17)).to.be.equal(proxy.address)

            await proxy.setImplementation(contract2.address)
            expect(await proxy.getImplementation()).to.be.equal(contract2.address)

            const implementationNew = new ethers.Contract(proxy.address, TEST_CONTRACT_2.interface, wallet)
            expect(await implementationNew.testAddress()).to.be.equal(proxy.address)
            expect(await implementationNew.testUInt()).to.be.equal(17)
            expect(await implementationNew.testMapping(17)).to.be.equal(proxy.address)
            expect(await implementationNew.testUInt16()).to.be.equal(0)
        })
    })  
})