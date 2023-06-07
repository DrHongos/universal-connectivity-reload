    Frontend
    - PeerData 
        - add protocol and multiaddr to peers (get in clipboard) (one can see what kind of nodes are the others!)
    - TopicData
        - topic data should include "unsuscribe" and info about suscribers for each topic
    - Separar y modularizar todos los componentes de la app 
        libp2p: chat y conexiones
        ipfs: helia, files and pinning
        filecoin: perpetual storage and deals
        web3: account connection and checks/validations/etc
        

    - Add helia                         < HERE WE GO!
        - share files in chat
    - give tools for perpetual storage
        - try to upload a file (unixfs?) with   (can be done locally too)
            financial_data_cid/asset/exchange/period_cid
            --> for retrieval as dataframe and apply lazy operations (polars)


    - validar user account 
        - breaks if it send 2 times wrong args

    - firmar el peerId libp2p para verificar en server        
        https://wagmi.sh/react/hooks/useSignMessage

    ------------------------------------------------------------------------------------
    Server
        - gossip channels
            - POST to server (server suscribes)
                - limit of threads? i need to open a DataStore for each topic?
        - verify signed messages
            - account
                - add commands in channels like check account is a particular peerId
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
