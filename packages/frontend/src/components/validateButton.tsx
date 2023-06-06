import { useSignMessage } from 'wagmi'
import { useAccount } from 'wagmi';
import { useLibp2pContext } from '@/context/ctx';
import { CHAT_TOPIC } from '@/lib/constants';

function ValidateAccount() {
    const { libp2p } = useLibp2pContext()
    const { address } = useAccount()
    let now_timestamp = () => Math.floor(Date.now()/ 1000)

    let message_items = [libp2p.peerId.toString(), address, now_timestamp()]
    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
        message: message_items.join("-"),
    })
    
    // needs to publish a message!
    async function sendValidation() {
        await signMessage()
        if (data) {
            await libp2p.services.pubsub.publish(
                CHAT_TOPIC,
                new TextEncoder().encode("/validate "+message_items.slice(1).join(" ")+" "+ data),
            )
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