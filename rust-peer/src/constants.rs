use std::time::Duration;

pub const TICK_INTERVAL: Duration = Duration::from_secs(15);
pub const KADEMLIA_PROTOCOL_NAME: &[u8] = b"/universal-connectivity/lan/kad/1.0.0";
pub const PORT_WEBRTC: u16 = 9090;
pub const PORT_QUIC: u16 = 9091;
pub const LOCAL_KEY_PATH: &str = "./local_key";
pub const LOCAL_CERT_PATH: &str = "./cert.pem";
