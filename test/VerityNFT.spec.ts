import { ethers, upgrades } from 'hardhat'
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'

describe('VerityNFT', function () {
  let verityNFT: Contract
  let originalImplementationAddress: string
  let owner: SignerWithAddress
  let nonOwner: SignerWithAddress
  let baseURI: string

  beforeEach(async () => {
    ;[owner, nonOwner] = await ethers.getSigners()
    const VerityNFT = await ethers.getContractFactory('VerityNFT')
    verityNFT = await upgrades.deployProxy(VerityNFT, [])
    originalImplementationAddress = await upgrades.erc1967.getImplementationAddress(
      verityNFT.address
    )
    await verityNFT.deployed()
    baseURI = 'https://ipfs.io/ipfs/'
  })

  describe('Deployment', () => {
    it('Should set the correct name and symbol', async () => {
      expect(await verityNFT.name()).to.equal('VerityNFT')
      expect(await verityNFT.symbol()).to.equal('VERY')
    })

    it('Should mint 4 tokens during deployment', async () => {
      expect(await verityNFT.balanceOf(owner.address)).to.equal(4)
    })

    it('Should set the correct baseURI', async () => {
      expect(await verityNFT.baseURI()).to.equal('')
      await verityNFT.setBaseURI(baseURI)
      expect(await verityNFT.baseURI()).to.equal(baseURI)
    })
  })

  describe('Token Metadata', () => {
    const tokenIds = [1, 2, 3, 4]
    const fileURI = 'Qmf9VAMw2D5VyKFgg5yEiGfUo8J4dEE9RFWHoccUaEBed6'

    beforeEach(async () => {
      for (const id of tokenIds) {
        await verityNFT.addFileToToken(id, fileURI)
      }
    })

    it('Should retrieve the correct token files', async () => {
      for (const id of tokenIds) {
        const files = await verityNFT.getTokenFiles(id)
        expect(files[0]).to.equal(fileURI)
      }
    })
  })

  describe('Upgraded Contract', () => {
    let verityNFTTest: Contract

    beforeEach(async () => {
      const VerityNFTTest = await ethers.getContractFactory('VerityNFTTest')
      verityNFTTest = await upgrades.upgradeProxy(verityNFT.address, VerityNFTTest)
    })

    it('should switch contract implementation to new contract', async () => {
      expect(await upgrades.erc1967.getImplementationAddress(verityNFTTest.address)).to.equal(
        await upgrades.erc1967.getImplementationAddress(verityNFT.address)
      )
    })

    it('should have a different implementation contract address to original', async () => {
      expect(await upgrades.erc1967.getImplementationAddress(verityNFTTest.address)).not.to.equal(
        originalImplementationAddress
      )
    })

    it('should have an add() method', async () => {
      expect(await verityNFTTest.add(1, 2)).to.equal(3)
    })
  })

  describe('setBaseURI', () => {
    it('should allow the owner to set the baseURI', async () => {
      const newBaseURI = 'https://new-base-uri.com/'
      await expect(verityNFT.setBaseURI(newBaseURI))
        .to.emit(verityNFT, 'BaseURIChanged')
        .withArgs(newBaseURI)

      expect(await verityNFT.baseURI()).to.equal(newBaseURI)
    })

    it('should revert when a non-owner tries to set the baseURI', async () => {
      const newBaseURI = 'https://new-base-uri.com/'
      await expect(verityNFT.connect(nonOwner).setBaseURI(newBaseURI)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
    })
  })
})
