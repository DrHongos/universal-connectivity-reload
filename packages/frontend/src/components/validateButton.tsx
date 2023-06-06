import { useSignMessage } from 'wagmi'
import { useAccount } from 'wagmi';
import { useLibp2pContext } from '@/context/ctx';
import { CHAT_TOPIC } from '@/lib/constants';
import { useEffect, useState } from 'react';

function ValidateAccount() {
    const { libp2p } = useLibp2pContext()
    const { address } = useAccount()
    const [items, setItems] = useState<string[]>([])

    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
        message: items.join("-"),
    })

    useEffect(() => {
        async function send_msg() {
            await libp2p.services.pubsub.publish(
                CHAT_TOPIC,
                new TextEncoder().encode("/validate "+items.slice(1).join(" ")+" "+ data),
            )
            setItems([])
        }
        if(isSuccess && data) {
            console.log("sending validation")
            send_msg()
        }
    }, [isSuccess, data])

    useEffect(() => {
        async function send() {
            await signMessage()
        }
        if(items.length == 3) {
            send()
        }
    }, [items])

    async function sendValidation() {
        if(address) {
            let val = Math.floor(Date.now()/ 1000)            
            setItems([
                libp2p.peerId.toString(),
                address.toString(),
                val.toString()
            ])
        }                
    }

    return (
        <div>
            {address &&
                <div>
                    <button disabled={isLoading} onClick={() => sendValidation()}>
                    Sign message
                    </button>
                    {isSuccess && <div>Signature: {data}</div>}
                    {isError && <div>Error signing message</div>}
                </div>
            }
        </div>
    )
}

export default ValidateAccount;