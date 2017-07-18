import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const assetFilter = (assets, exp) => assets.filter((asset) => asset.match(exp))

const renderScripts = (scripts) => (
  scripts.map((script, index) => (
    <script key={index} src={script} />
  ))
)

const renderStyles = (styles) => (
  styles.map((s, i) => (
    <link rel='stylesheet' href={s} key={i} />
  ))
)

const BrowserWarning = () => (<div>Hello there</div>)

const Document = ({
  content,
  state = {},
  scripts = ['/main.js'],
  styles = ['/main.css']
}) => (
  <html>
    <head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      {renderStyles(styles)}
    </head>
    <body>
      <main
        id='mount'
        dangerouslySetInnerHTML={{
          __html: content
        }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (!(window.ActiveXObject) && 'ActiveXObject' in window) {
              var elem = document.createElement('div')
              elem.innerHTML = '${renderToStaticMarkup(<BrowserWarning />)}'
              document.body.append(elem)
            }
          `
        }}
      />

      <script
        id='initial-state'
        type='application/json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(state)
        }}
      />

      {renderScripts(scripts)}
    </body>
  </html>
)

export default ({
  assets,
  content,
  state = {}
}) => (
  '<!doctype html>' + renderToStaticMarkup(
    <Document
      scripts={assetFilter(assets, /\.js$/)}
      styles={assetFilter(assets, /\.css$/)}
      content={content}
      state={state}
    />
  )
)
