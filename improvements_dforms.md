    Frontend
    - Separar y modularizar todos los componentes de la app 
        libp2p: chat y conexiones
        ipfs: helia, files and pinning
        filecoin: perpetual storage and deals
        web3: account connection and checks/validations/etc
    - PeerData 
        - add protocol and multiaddr to peers (get in clipboard) (one can see what kind of nodes are the others!)
    - TopicData
        - topic data should include "unsuscribe" and info about suscribers for each topic


    - helia
        - load files in app 
        - pin and check CIDs
        - share files in chat -> share CID
    DB
        - record gossipsub channels and store locally
            - button to "sync" with rust-peer
    FILECOIN
    - give tools for perpetual storage
        - try to upload a file (unixfs?) with   (can be done locally too)
            financial_data_cid/asset/exchange/period_cid
            --> for retrieval as dataframe and apply lazy operations (polars)

    BUGS
    - validar user account 
        - breaks if it send 2 times wrong args


    ------------------------------------------------------------------------------------
    Server
        - gossip channels
            - POST to server (server suscribes)
                - limit of threads? i need to open a DataStore for each topic?
        - verify signed messages
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
