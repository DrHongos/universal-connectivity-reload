import React, { createContext, useContext, useState } from 'react';

export interface Web3Interface {
	account: string | null;
	//setMessageHistory: (messageHistory: ChatMessage[]) => void;
}

export interface Web3ContextInterface {
	account: string | null;
//	setMessageHistory: (messageHistory: ChatMessage[]) => void;
}

export const web3Context = createContext<Web3ContextInterface>({
	account: null,
//	setMessageHistory: () => { }
})

export const useWeb3Context = () => {
	return useContext(web3Context);
};

export const Web3Provider = ({ children }: any) => {
//	const [messageHistory, setMessageHistory] = useState<Web3Message[]>([]);
    const [account, setAccount] = useState<string | null>(null)
	return (
		<web3Context.Provider value={{ account }}>
			{children}
		</web3Context.Provider>
	);
};

