import { useRef, useEffect } from "react"
import { createIcon } from '@download/blockies'
import { PeerProtoTuple } from '@/utils/types'
import { short_text, copyToClipboard } from '@/utils/helpers'


function PeerInfo({peerId, protocols}: PeerProtoTuple) {
    const msgref = useRef<HTMLLIElement>(null)
    useEffect(() => {
      const icon = createIcon({
        seed: peerId,
        size: 15,
        scale: 3,
      })
      icon.className = 'rounded mr-2 max-h-8 max-w-8'
      const childrenCount = msgref.current?.childElementCount
      // Prevent inserting an icon more than once.
      if (childrenCount && childrenCount < 2) {
        msgref.current?.insertBefore(icon, msgref.current?.firstChild)
      }
    }, [peerId])
  
    return (
      <li ref={msgref} className={`flex justify-start`}>
        <div
          className="flex relative max-w-xl px-4 py-2 text-gray-700 rounded shadow bg-white"
          style={{justifyContent: 'space-between', width: '100%'}}
        >
          {short_text(peerId)}
          <button
            style={{
              border: '1px solid gray',
              borderRadius: '5px',
              backgroundColor: 'lightgray',
              padding: '5px'
            }} 
            onClick={() => copyToClipboard(`${peerId}`)}
          >Copy</button>
        </div>
      </li>
    )
}

export default PeerInfo;