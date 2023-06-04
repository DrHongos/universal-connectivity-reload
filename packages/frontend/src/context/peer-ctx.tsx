import React, { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import type { Connection } from '@libp2p/interface-connection'
import { PeerId } from '@libp2p/interface-peer-id'
import { useLibp2pContext } from './ctx'
import {
	multiaddr,
	Multiaddr,
  } from '@multiformats/multiaddr'
  
export interface PeerStats {
	peerIds: PeerId[]
	connected: boolean
	connections: Connection[]
	latency: number
}

export interface PeerContextInterface {
	peerStats: PeerStats;
	setPeerStats: (peerStats: PeerStats) => void;
}
export const peerContext = createContext<PeerContextInterface>({
	peerStats: {
		peerIds: [],
		connected: true,
		connections: [],
		latency: 0
	},
	setPeerStats: () => { }	
})

export const usePeerContext = () => {
	return useContext(peerContext);
};

export const PeerProvider = ({ children }: { children: ReactNode }) => {
	const { libp2p } = useLibp2pContext();
	const [peerStats, setPeerStats] = useState<PeerStats>({
		peerIds: [],
		connected: false,
		connections: [],
		latency: 0
	});
	const [rustNodeMultiaddr, setRustNodeMultiaddr] = useState<string[] | null>();

	useEffect(() => {
/* 		async function get_rust_node_multiaddr() {
			fetch("http://localhost:8080/", {					// p*to CORS!
//					headers: {
//						'Access-Control-Allow-Origin': '*',
//					}	
					mode: "no-cors"	// opaque response
				})
				.then(response => response.text())	// nothing.. futile
				.then(data => {
				// Parse the plain text here
					console.log(data);
				})
				.catch(error => {
				// Handle any errors
				console.error('Error:', error);
				});
			//res_p = res_p.split(", ");
			//if (res_p.length > 0) {
			//	console.log(`setting rust node addresses ${res_p}`)
			//	setRustNodeMultiaddr(res_p)			
			//}
		}
*/
		// query the server,
		console.log("performing query")
		// filter response
		// dial the correct one
		if (!rustNodeMultiaddr) {
//			get_rust_node_multiaddr()
			let response_faked = "/ip4/127.0.0.1/udp/9090/webrtc-direct/certhash/uEiBpsYayXhcHojJRhUzvWydJKgIVidBaMfcZuGuUXucZWw/p2p/12D3KooWLi34cWMCHtKefYtcrPgG2Q5ywofQbpd6jCijgF84cFLo,/ip4/192.168.0.14/udp/9090/webrtc-direct/certhash/uEiBpsYayXhcHojJRhUzvWydJKgIVidBaMfcZuGuUXucZWw/p2p/12D3KooWLi34cWMCHtKefYtcrPgG2Q5ywofQbpd6jCijgF84cFLo,/ip4/172.17.0.1/udp/9090/webrtc-direct/certhash/uEiBpsYayXhcHojJRhUzvWydJKgIVidBaMfcZuGuUXucZWw/p2p/12D3KooWLi34cWMCHtKefYtcrPgG2Q5ywofQbpd6jCijgF84cFLo,/ip4/127.0.0.1/udp/9091/quic-v1/p2p/12D3KooWLi34cWMCHtKefYtcrPgG2Q5ywofQbpd6jCijgF84cFLo,/ip4/192.168.0.14/udp/9091/quic-v1/p2p/12D3KooWLi34cWMCHtKefYtcrPgG2Q5ywofQbpd6jCijgF84cFLo,/ip4/172.17.0.1/udp/9091/quic-v1/p2p/12D3KooWLi34cWMCHtKefYtcrPgG2Q5ywofQbpd6jCijgF84cFLo"
			let listening_addresses = response_faked.split(",")
			console.log(`dialing ${listening_addresses[2]}`)
			let multiaddre = multiaddr(listening_addresses[2])
			libp2p.dial(multiaddre)
			setRustNodeMultiaddr(listening_addresses)
		}
	}, [rustNodeMultiaddr])

	return (
		<peerContext.Provider value={{ peerStats, setPeerStats }}>
			{children}
		</peerContext.Provider>
	);
};

