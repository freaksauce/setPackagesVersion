import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrandProvider } from '@iag/chroma-react-ui-utils.brand-provider'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrandProvider version="1.0.1">
      <div>test</div>
    </BrandProvider>
  </React.StrictMode>
)
