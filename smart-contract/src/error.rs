use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Challenge already exists")]
    ChallengeExists {},

    #[error("Challenge not found")]
    ChallengeNotFound {},

    #[error("Challenge already completed")]
    ChallengeAlreadyCompleted {},
}
