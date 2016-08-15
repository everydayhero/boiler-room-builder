const { keys } = Object

module.exports = (stats, publicPath) => {
  const { assetsByChunkName: chunks } = stats.toJson()

  return keys(chunks).reduce((acc, name) => {
    const chunkAssets = chunks[name]
    if (chunkAssets instanceof Array) {
      return acc.concat(chunkAssets.map((chunkAsset) => (
        publicPath + chunkAsset
      )))
    } else {
      return acc.concat(publicPath + chunkAssets)
    }
  }, [])
}
