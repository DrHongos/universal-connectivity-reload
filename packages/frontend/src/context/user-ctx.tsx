//import { Multiaddr } from '@multiformats/multiaddr';
//import { Address } from 'wagmi';
import React, { createContext, useContext, useState } from 'react';
import { useLibp2pContext } from './ctx';

/* 
another idea?:
{
    signature: {
        message: MESSAGE,
        account: ACCOUNT
    }
}


*/

export interface UserInfoInterface {
	name: string,
//    peerId: Multiaddr,
//    lastMessageTimestamp: number,
//    account: Address | undefined,
//    ens: String | undefined
    setName: (name: string) => void
//    setAccount: (acc: Address) => void
}
export const userInfoContext = createContext<UserInfoInterface>({
	name: "unknwon",
    setName: () => {}
})

export const useUserInfoContext = () => {
	return useContext(userInfoContext);
};

export const UserProvider = ({ children }: any) => {
    const { helia } = useLibp2pContext()
    const [name, setName] = useState<string>("unknown")

   
    return (
		<userInfoContext.Provider value={{ name, setName }}>
			{children}
		</userInfoContext.Provider>
	);
};

