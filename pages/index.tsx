import React from 'react'
import { Web3AuthContext } from '../lib/web3authcontext'

function App() {
  const context = React.useContext(Web3AuthContext)

  const loginView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={context.logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: 'pre-line' }}>
        <p style={{ whiteSpace: 'pre-line' }}></p>
      </div>
    </>
  )

  const logoutView = (
    <button onClick={context.login} className="card">
      Login
    </button>
  )

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>{' '}
        & NextJS Server Side Verification Example
      </h1>

      <div className="grid">{context.provider ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/web-core-sdk/server-side-verification/ssv-via-social-nextjs-core-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a
          href="https://goerlifaucet.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Goerli Faucet
        </a>
      </footer>
    </div>
  )
}

export default App
