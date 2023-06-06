import { useLibp2pContext } from '@/context/ctx'
import { useState, useCallback, useEffect } from "react"

interface TopicsControlProps {
    topicSelected: string,
    setTopicSelected: (d: string) => void
}

function TopicsControl({topicSelected, setTopicSelected}: TopicsControlProps) {
    const [topicToSuscribe, setTopicToSuscribe] = useState<string | null>(null)
    const [topicsList, setTopicsList] = useState<string[]>([])
    const { libp2p } = useLibp2pContext()

    useEffect(() => {
        setInterval(() => updateTopics(), 10000)
    }, [])

    const updateTopics = () => {
        let topics = libp2p.services.pubsub.getTopics()
        if (topics != topicsList) {
          setTopicsList(topics)
        }
    }
    
    const handleTopicChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          setTopicToSuscribe(e.target.value)
        },
        [setTopicToSuscribe],
    )
    const suscribeToTopic = () => {
        if (topicToSuscribe) {
          libp2p.services.pubsub.subscribe(topicToSuscribe)
          updateTopics()
          setTopicToSuscribe(null)
        }
    }

    return (
        <>  
        <div
            style={{border: "1px solid gray", padding: "10px", borderRadius: "10px"}}
        >
            <h3 className="text-xl">
            {' '}
            Your topics
            </h3>
            <ul>
            {topicsList.length > 0 && topicsList.map((d) => 
                <li
                key={d}
                style={{
                    backgroundColor: d == topicSelected ? "lightgreen" : "white",
                    border: d == topicSelected ? "darkgreen" : "lightgray",
                    fontWeight: d == topicSelected ? 900 : 700,
                    padding: "10px",
                    justifyContent: "center"
                }}
                onClick={() => setTopicSelected(d)}
                >
                {d}{' '}
                -{' '}
                ({libp2p.services.pubsub.getSubscribers(d).length/* does not update */})
                </li>
            )}
            </ul>
            <hr style={{marginBottom: "15px"}}></hr>
            <input 
            style={{
                borderRadius: "10px",
                padding: "5px",
                marginRight: "15px",
                border: "1px solid magenta",
                width: "40%"
            }}
            onChange={handleTopicChange}
            />
            <button
            disabled={!topicToSuscribe}
            onClick={() => suscribeToTopic()}
            >
            {topicToSuscribe ? "Suscribe!" : "Add a topic to suscribe"}
        </button>
      </div>
    </>
    )
}

export default TopicsControl;