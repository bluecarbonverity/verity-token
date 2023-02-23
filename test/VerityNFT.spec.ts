import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'

describe('VerityNFT', function () {
  let verityNFT: Contract
  let owner: SignerWithAddress
  let nonOwner: SignerWithAddress
  let baseURI: string

  beforeEach(async () => {
    ;[owner, nonOwner] = await ethers.getSigners()
    const VerityNFT = await ethers.getContractFactory('VerityNFT')
    verityNFT = await VerityNFT.deploy()
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
    const files = [
      'Qmf9VAMw2D5VyKFgg5yEiGfUo8J4dEE9RFWHoccUaEBed6',
      'Qmf9VAMw2D5VyKFgg5yEiGfUo8J4dEE9RFWHoccUaEBed6',
    ]

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

    it('Should overwrite token files in dev mode', async () => {
      const tokenId = 1
      await verityNFT.devOverwriteTokenFiles(tokenId, files)
      const retrievedFiles = await verityNFT.getTokenFiles(tokenId)
      expect(retrievedFiles).to.eql(files)
    })
  })

  describe('setBaseURI', () => {
    it('should allow the owner to set the baseURI', async function () {
      const newBaseURI = 'https://new-base-uri.com/'
      await expect(verityNFT.setBaseURI(newBaseURI))
        .to.emit(verityNFT, 'BaseURIChanged')
        .withArgs(newBaseURI)

      expect(await verityNFT.baseURI()).to.equal(newBaseURI)
    })

    it('should revert when a non-owner tries to set the baseURI', async function () {
      const newBaseURI = 'https://new-base-uri.com/'
      await expect(verityNFT.connect(nonOwner).setBaseURI(newBaseURI)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
    })
  })

  describe('devOverwriteTokenFiles', () => {
    const tokenIds = [1, 2, 3, 4]
    const fileURI = 'Qmf9VAMw2D5VyKFgg5yEiGfUo8J4dEE9RFWHoccUaEBed6'
    const files = [
      'Qmf9VAMw2D5VyKFgg5yEiGfUo8J4dEE9RFWHoccUaEBed6',
      'Qmf9VAMw2D5VyKFgg5yEiGfUo8J4dEE9RFWHoccUaEBed6',
    ]

    beforeEach(async () => {
      for (const id of tokenIds) {
        await verityNFT.addFileToToken(id, fileURI)
      }
    })

    it('Should allow the owner to overwrite token files in dev mode', async () => {
      const tokenId = 1
      await verityNFT.devOverwriteTokenFiles(tokenId, files)
      const retrievedFiles = await verityNFT.getTokenFiles(tokenId)
      expect(retrievedFiles).to.eql(files)
    })

    it('should revert when a non-owner tries to overwrite token files in dev mode', async function () {
      const tokenId = 1
      const newBaseURI = 'https://new-base-uri.com/'
      await expect(
        verityNFT.connect(nonOwner).devOverwriteTokenFiles(tokenId, files)
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })
})
