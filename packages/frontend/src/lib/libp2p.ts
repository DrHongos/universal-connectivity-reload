import { createLibp2p, Libp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'
import {
  multiaddr,
  Multiaddr,
} from '@multiformats/multiaddr'
import { sha256 } from 'multiformats/hashes/sha2'
import type { Message, SignedMessage } from '@libp2p/interface-pubsub'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { CHAT_TOPIC, CIRCUIT_RELAY_CODE, WEBRTC_BOOTSTRAP_NODE, WEBTRANSPORT_BOOTSTRAP_NODE } from './constants'
import * as filters from "@libp2p/websockets/filters"
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'

export async function startLibp2p() {
  // localStorage.debug = 'libp2p*,-*:trace'
  // application-specific data lives in the datastore

  const libp2p = await createLibp2p({
    addresses: {
      listen: [
        '/webrtc'
      ]
    },
    transports: [
      webTransport(), 
      webSockets({
        filter: filters.all,
      }), 
      webRTC({
        rtcConfiguration: {
          iceServers:[
            {
              urls: [
                'stun:stun.l.google.com:19302',
                'stun:global.stun.twilio.com:3478'
              ]
            }
          ]
        }
      }), 
      webRTCDirect(), 
      circuitRelayTransport({
        discoverRelays: 1,
      }),
    ],
    connectionManager: {
      maxConnections: 10,
      minConnections: 2   // 5?? why?
    },
    connectionEncryption: [noise()],
    connectionGater: {
      denyDialMultiaddr: async () => false,
    },
    streamMuxers: [yamux()],
    peerDiscovery: [
      bootstrap({
        list: [
//          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
//          '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
//          '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
//          '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
          WEBRTC_BOOTSTRAP_NODE,
          WEBTRANSPORT_BOOTSTRAP_NODE,
        ],
      }),
    ],
    services: {                     // added, work to bump this Libp2p implementation
      pubsub: gossipsub({
        allowPublishToZeroPeers: true,
        msgIdFn: msgIdFnStrictNoSign,
        ignoreDuplicatePublishError: true,
      }),
      dht: kadDHT(),
      identify: identifyService()
    },
  })

  libp2p.services.pubsub.subscribe(CHAT_TOPIC)
  libp2p.addEventListener('self:peer:update', ({detail: { peer }}) => {
    const multiaddrs = peer.addresses.map(({ multiaddr }) => multiaddr)
    console.log(`changed multiaddrs: peer ${peer.id.toString()} multiaddrs: ${multiaddrs}`)
    setWebRTCRelayAddress(multiaddrs, libp2p.peerId.toString())
  })
  return libp2p
}

// message IDs are used to dedup inbound messages
// every agent in network should use the same message id function
// messages could be perceived as duplicate if this isnt added (as opposed to rust peer which has unique message ids)
export async function msgIdFnStrictNoSign(msg: Message): Promise<Uint8Array> {
  var enc = new TextEncoder();

  const signedMessage = msg as SignedMessage
  const encodedSeqNum = enc.encode(signedMessage.sequenceNumber.toString());
  return await sha256.encode(encodedSeqNum)
}


export const setWebRTCRelayAddress = (maddrs: Multiaddr[], peerId: string) => {
  maddrs.forEach((maddr) => {
    if (maddr.protoCodes().includes(CIRCUIT_RELAY_CODE)) {

      const webRTCrelayAddress = multiaddr(maddr.toString() + '/webrtc/p2p/' + peerId)

//      console.log(`Listening on '${webRTCrelayAddress.toString()}'`)
    }
  })
}

export const connectToMultiaddr =
  (libp2p: Libp2p) => async (multiaddr: Multiaddr) => {
    console.log(`dialling: ${multiaddr.toString()}`)
    try {
      const conn = await libp2p.dial(multiaddr)
      console.info('connected to', conn.remotePeer, 'on', conn.remoteAddr)
      return conn
    } catch (e) {
      console.error(e)
      throw e
    }
}

