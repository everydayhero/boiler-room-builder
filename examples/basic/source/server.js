export default (assets) => {
  const renderDocument = (name) => ([
    'Hello, ' + name,
    'Assets: ', Object.keys(assets).join(', ')
  ].join('\n'))

  const app = (name) => Promise.resolve({
    result: renderDocument(name)
  })

  return {
    app,
    renderDocument
  }
}
