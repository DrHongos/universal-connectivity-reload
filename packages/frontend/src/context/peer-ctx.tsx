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
		async function get_rust_node_multiaddr() {
			fetch("http://localhost:8080/", {})
				.then(response => response.text())	// nothing.. futile
				.then(data => {
					console.log(data);
					let data_p = data.split(",");
					if (data_p.length > 0) {
						console.log(`setting rust node addresses ${data_p}`)
						setRustNodeMultiaddr(data_p)			
					}
				})
				.catch(error => {
				console.error('Error:', error);
				});
		}
		// query the server,
		console.log("performing query")
		// filter response
		// dial the correct one
		if (!rustNodeMultiaddr) {
			get_rust_node_multiaddr()
		} else {
			// check if we are already connected
			let correct_multiaddr = rustNodeMultiaddr[2]; //CAREFUL

			if (peerStats.peerIds.length === 0) {				
				// else dial()
				let multiaddre = multiaddr(correct_multiaddr)
				libp2p.dial(multiaddre)
			}
		}
	}, [rustNodeMultiaddr])

	return (
		<peerContext.Provider value={{ peerStats, setPeerStats }}>
			{children}
		</peerContext.Provider>
	);
};

