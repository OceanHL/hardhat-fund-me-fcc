const { network } = require("hardhat")
const { networkConfig, developmentChain } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts() // 获得命名账户（部署者）
    const chainId = network.config.chainId

    console.log(chainId, network.name)
    // 通过【链id】来使用不同的价格地址
    let ethUsdPriceFeedAddress
    // = networkConfig[chainId]["ethUsdPriceFeed"]
    if (chainId == 31337) {
        // 如果运行的【开发环境区块链】，则从 MockV3Aggregator 中获得价格地址
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        // 生产【主网络】
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const args = [
        /** address */
        ethUsdPriceFeedAddress,
    ]
    const fundMe = await deploy("FundMe", {
        from: deployer, // 谁部署这个合约
        args, // 给这个合约传递什么参数【构造函数参数】
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    // 验证合约
    if (
        !developmentChain.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // await verify(fundMe.address, args)
    }
    log("---------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
