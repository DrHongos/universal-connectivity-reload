use std::str::FromStr;
use ethers::types::Address;
use ethers::types::{Signature};
use anyhow::{Result, anyhow};
use log::info;

pub fn validate_account(msg: String, peer_id: String) -> Result<String> {
    let mut msg_list = msg.split_whitespace();
    msg_list.next(); // discard command    

    
    let account = msg_list.next();
    let timestamp_signature = msg_list.next();
    let signed_message = msg_list.next();
    
    match (
        account,
        timestamp_signature,
        signed_message
    ) {
        (Some(acc), Some(ts), Some(sm)) => {
            match (
                Address::from_str(acc),
                Signature::from_str(&sm)
            ) {
                (Ok(add), Ok(sig)) => {
                    let message = vec![peer_id, acc.to_string(), ts.to_string()].join("-");
                    info!("Gonna check that the message {} is signed by the account: {}", sig, add);
                    match sig.recover(message) {
                        Ok(acc) => {
                            if acc == add {
                                Ok(format!("{:#?}", add))
                            } else {
                                Err(anyhow!("Not the correct account"))
                            }
                        },
                        _ => {
                            Err(anyhow!("Error during validation of account"))
                        }
                    }
                },
                (Ok(_add), Err(_err)) => Err(anyhow!("Error in signed message")),
                (Err(_err), Ok(_sig)) => Err(anyhow!("Error in account")),
                _ => Err(anyhow!("Error unkown"))
            }
        },
        _ => Err(anyhow!("Error in variables"))
    }
}
