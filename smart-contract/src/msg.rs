use cosmwasm_schema::{cw_serde, QueryResponses};

#[cw_serde]
pub struct InstantiateMsg {
    pub owner: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    CreateChallenge {
        id: String,
        difficulty: String,
        reward_xp: u64,
        reward_coins: u64,
    },
    CompleteChallenge {
        id: String,
        completion_date: u64,
        proof_hash: String,
    },
    RewardUser {
        user: String,
        xp: u64,
        coins: u64,
    },
    MintAchievementNft {
        user: String,
        achievement_id: String,
        ipfs_uri: String,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ChallengeResponse)]
    GetChallenge { id: String },

    #[returns(UserStatsResponse)]
    GetUserStats { user: String },
}

#[cw_serde]
pub struct ChallengeResponse {
    pub id: String,
    pub creator: String,
    pub difficulty: String,
    pub reward_xp: u64,
    pub reward_coins: u64,
    pub completed: bool,
    pub completion_date: Option<u64>,
    pub proof_hash: Option<String>,
}

#[cw_serde]
pub struct UserStatsResponse {
    pub user: String,
    pub total_xp: u64,
    pub total_coins: u64,
    pub completed_challenges: u32,
}
