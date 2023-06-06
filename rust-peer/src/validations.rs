use ethers::types::Address;
use ethers::types::{Signature, Bytes};
use anyhow::Result;
use log::info;

pub fn validate_account(msg: String) -> Result<bool> {
    // Assuming you have the following signed message and signature
//    let message = Bytes::from("Hello, world!");
//    let signature = Signature::from_rsv(
//        Bytes::from("0x12..."),  // R value
//        Bytes::from("0x34..."),  // S value
//        27,                      // Recovery ID (27 or 28)
//    );

    let mut msg_list = msg.split_whitespace();
    msg_list.next(); // discard command
    let account = msg_list.next().expect("should be an account address");
    let timestamp_signature = msg_list.next().expect("should be a timestamp");
    let signed_message = msg_list.next().expect("should be a signed message of the peerId and the timestamp at signing");
    
    info!("to validate >>>> account: {} - timestamp: {} - signed_message: {}", account, timestamp_signature, signed_message);
    // Assuming you have the signer's address
//    let signer_address = Address::from_str("0x1a2B3c4D5E6F...");

    // Validate the signed message
//    let recovered_address = recover(&message, &signature).expect("Failed to recover address");

    Ok("recovered_address" == account)
}
