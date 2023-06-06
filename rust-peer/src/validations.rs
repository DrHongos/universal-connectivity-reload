use std::str::FromStr;
use ethers::types::Address;
use ethers::types::{Signature};
use log::info;

pub fn validate_account(msg: String, peer_id: String) -> Option<String> {
    let mut msg_list = msg.split_whitespace();
    msg_list.next(); // discard command
    let account = msg_list.next().expect("should be an account address");
    let timestamp_signature = msg_list.next().expect("should be a timestamp");

    let signed_message = msg_list.next().expect("should be a signed message of the peerId and the timestamp at signing");
    let message = vec![peer_id, account.to_string(), timestamp_signature.to_string()].join("-");
    let signature = Signature::from_str(&signed_message).expect("error parsing message");
    let address = Address::from_str(account).expect("error parsing address");
//    info!("message {}", message);
    info!("Gonna check that the message {} is signed by the account: {}", signed_message, account);
    match signature.recover(message) {
        Ok(acc) => {
            if acc == address {
//                info!("Yayyy it is");
                Some(format!("{:#?}", address))
            } else {
//                info!("NO is {:#?}", acc);
                None
            }
        },
        _ => {
            info!("Something is wrong");
            None
        }
    }

}
