Start from universal-connectivity-reload

    qUIcky 
    - refactor PeerData (and soon TopicData)
        - add protocol and multiaddr to peers (get in clipboard)
        - topic data should include "unsuscribe" and info about suscribers

    - check rust multiaddress is always connected or try to reconnect
    - gossip channels                            <
        - POST to server (server suscribes)
            - limit of threads? i need to open a DataStore for each topic?
    ------------------------------------------------------------------------------------
    Agregar web3:
        - WAGMI? -> firmar el nodo libp2p para verificar en server -> access control

    ------------------------------------------------------------------------------------
    - return in API GET query               << CORS.. intentar subirlo en el servidor..
        - rechaza todo tipo de calls.. idk

    ------------------------------------------------------------------------------------
    - add rust-ipfs to server (to use log? store messages? etc...)
    - add helia to browser node

            START STORING => Perpetual storage (filecoin)
    diseñar el sistema de gestion de la data
        muchas actualizaciones => corta vida al contrato & mayor precio (?)
        pocas actualizaciones => larga vida y bajo precio
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        



        para que quiero un server?
            - rendevouz?
            - data processing (ipfs-logs) to CID?
            - access control
            - once connected, it also is a relayer
                - create new topics
                - logs all messages (creates database) -> tambien con nodo en browser (Helia?)








create an actix-web server that creates IPFS instances that replicates (pubsub)
an orbitdb database, later can introduce perpetual storage, version (and updates) management,
and cid retrieval for users databases.

- webapp (REBUILD)                      --- test before start coding with: testing_helia
    - upgrade js-ipfs to Helia              DONE
    - connect to server (pubsub::topic)     WIP (no detecta otros peers.. ni se puede comunicar con dforms)
        suscribe DONE
        swarming and connect NOT!   <

    - add orbit-db                          CHECK
    - can i replicate in the server? (if same transport.. websockets!)

- server
    - create IPFS instance
        - for groups (?)
    - suscribe to pubsub
        - replicates?
            - WIP (how to swarm with browser nodes)
        - on requirement
    - retrieve (or directly upload db to IPFS)
    - make deals on filecoin
    - update and manage databases (and changes)
    - relayer (?) rendezvous (?)