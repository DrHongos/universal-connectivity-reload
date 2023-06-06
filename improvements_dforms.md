    Frontend
    - PeerData 
        - add protocol and multiaddr to peers (get in clipboard) (one can see what kind of nodes are the others!)
    - TopicData
        - topic data should include "unsuscribe" and info about suscribers for each topic


    - Add helia
        - share files in chat
            - give tools for perpetual storage
            - try to upload a file (unixfs?) with   (can be done locally too)
                financial_data_cid/asset_exchange_period_cid
                --> for retrieval as dataframe and apply lazy operations (polars)


        jugar un ratito con implementar Helia, pero el OBJETIVO de hoy es implementar al menos un servicio en el rust-peer
        - validar user account 
            - firmar mensaje en frontend y enviar mensaje:
                .publish(`/valAccount ${account} ${signedMessage}`)
            - validar en server: 
                Public Message: At [datetime] the node [peerId] was validated as [account]

bumped libp2p and other dependencies
    - no hay relayer activado, FIXME
    - needs to ts-ignore a lot of conditioned stuff in components

    BUG BUG    BUG BUG    BUG BUG    BUG BUG    BUG BUG    BUG BUG
        helia uses ipfs-bitswap that inside implements 
            "@libp2p/interface-libp2p": "^3.1.0",
            helia uses "^3.2.0"
                that changes considerable the Libp2p type !
            - try to check if it works (it breaks)
            - bump ipfs-bitswap dependency (locally (try again))
    BUG BUG    BUG BUG    BUG BUG    BUG BUG    BUG BUG    BUG BUG


    - firmar el nodo libp2p para verificar en server
        https://wagmi.sh/react/hooks/useSignMessage

    ------------------------------------------------------------------------------------
    Server
        - gossip channels
            - POST to server (server suscribes)
                - limit of threads? i need to open a DataStore for each topic?
        - verify signed messages
            - account
                - add commands in channels like check account is a particular peerId
                    (the rust-peer itself will confirm (and maybe store))
                    something like: /verify 0x...lala [SIGNED MESSAGE] where signed message is the peerId(+time?) 
            - balance's
            - DAO membership
        - add rust-ipfs to server (to use log? store messages? etc...)
            https://docs.rs/rust-ipfs/0.3.16/rust_ipfs/repo/index.html


    ------------------------------------------------------------------------------------
    Filecoin:
            START STORING => Perpetual storage (filecoin)
    diseñar el sistema de gestion de la data
        muchas actualizaciones => corta vida al contrato & mayor precio (?)
        pocas actualizaciones => larga vida y bajo precio


    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
