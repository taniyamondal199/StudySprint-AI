use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct ChallengeInfo {
    pub id: String,
    pub creator: Addr,
    pub difficulty: String,
    pub reward_xp: u64,
    pub reward_coins: u64,
    pub completed: bool,
    pub completion_date: Option<u64>,
    pub proof_hash: Option<String>,
}

#[cw_serde]
pub struct UserStats {
    pub total_xp: u64,
    pub total_coins: u64,
    pub completed_challenges: u32,
}

pub const OWNER: Item<Addr> = Item::new("owner");
pub const CHALLENGES: Map<&str, ChallengeInfo> = Map::new("challenges");
pub const USER_STATS: Map<&Addr, UserStats> = Map::new("user_stats");
