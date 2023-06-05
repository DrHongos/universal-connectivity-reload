import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { short_text } from '@/utils/helpers' 
import { disconnect } from '@wagmi/core'

function Account() {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
 
  if (isConnected)  
    return (
        <div>
            <h3>Your account</h3>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                {/* @ts-ignore: isConnected conditions address right!? */}
                Connected to {ensName ?? short_text(address)}
                <button
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textDecoration: 'none',
                        backgroundColor: 'red',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}
                    onClick={async () => await disconnect()}
                >Disconnect</button>    
            </div>
        </div>
    )

  return ( 
    <button 
        style={{
            display: 'inline-block',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            textDecoration: 'none',
            backgroundColor: '#4c6ef5',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        }}
        onClick={() => connect()}
    >
        Connect Wallet
    </button>
)}

export default Account;