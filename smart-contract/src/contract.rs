#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{
    ChallengeResponse, ExecuteMsg, InstantiateMsg, QueryMsg, UserStatsResponse,
};
use crate::state::{ChallengeInfo, UserStats, CHALLENGES, OWNER, USER_STATS};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:studysprint-contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let owner_addr = deps.api.addr_validate(&msg.owner)?;
    OWNER.save(deps.storage, &owner_addr)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateChallenge {
            id,
            difficulty,
            reward_xp,
            reward_coins,
        } => execute_create_challenge(deps, info, id, difficulty, reward_xp, reward_coins),

        ExecuteMsg::CompleteChallenge {
            id,
            completion_date,
            proof_hash,
        } => execute_complete_challenge(deps, info, id, completion_date, proof_hash),

        ExecuteMsg::RewardUser { user, xp, coins } => {
            execute_reward_user(deps, info, user, xp, coins)
        }

        ExecuteMsg::MintAchievementNft {
            user,
            achievement_id,
            ipfs_uri,
        } => execute_mint_nft(deps, info, user, achievement_id, ipfs_uri),
    }
}

pub fn execute_create_challenge(
    deps: DepsMut,
    info: MessageInfo,
    id: String,
    difficulty: String,
    reward_xp: u64,
    reward_coins: u64,
) -> Result<Response, ContractError> {
    if CHALLENGES.has(deps.storage, &id) {
        return Err(ContractError::ChallengeExists {});
    }

    let challenge = ChallengeInfo {
        id: id.clone(),
        creator: info.sender.clone(),
        difficulty,
        reward_xp,
        reward_coins,
        completed: false,
        completion_date: None,
        proof_hash: None,
    };

    CHALLENGES.save(deps.storage, &id, &challenge)?;

    Ok(Response::new()
        .add_attribute("action", "create_challenge")
        .add_attribute("challenge_id", id)
        .add_attribute("creator", info.sender.to_string()))
}

pub fn execute_complete_challenge(
    deps: DepsMut,
    info: MessageInfo,
    id: String,
    completion_date: u64,
    proof_hash: String,
) -> Result<Response, ContractError> {
    let mut challenge = CHALLENGES
        .load(deps.storage, &id)
        .map_err(|_| ContractError::ChallengeNotFound {})?;

    if challenge.creator != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    if challenge.completed {
        return Err(ContractError::ChallengeAlreadyCompleted {});
    }

    challenge.completed = true;
    challenge.completion_date = Some(completion_date);
    challenge.proof_hash = Some(proof_hash);

    CHALLENGES.save(deps.storage, &id, &challenge)?;

    // Update user stats
    let user_addr = info.sender.clone();
    let mut stats = USER_STATS
        .load(deps.storage, &user_addr)
        .unwrap_or(UserStats {
            total_xp: 0,
            total_coins: 0,
            completed_challenges: 0,
        });

    stats.total_xp += challenge.reward_xp;
    stats.total_coins += challenge.reward_coins;
    stats.completed_challenges += 1;

    USER_STATS.save(deps.storage, &user_addr, &stats)?;

    Ok(Response::new()
        .add_attribute("action", "complete_challenge")
        .add_attribute("challenge_id", id)
        .add_attribute("user", user_addr.to_string())
        .add_attribute("xp_gained", challenge.reward_xp.to_string())
        .add_attribute("coins_gained", challenge.reward_coins.to_string()))
}

pub fn execute_reward_user(
    deps: DepsMut,
    info: MessageInfo,
    user: String,
    xp: u64,
    coins: u64,
) -> Result<Response, ContractError> {
    let owner = OWNER.load(deps.storage)?;
    if info.sender != owner {
        return Err(ContractError::Unauthorized {});
    }

    let user_addr = deps.api.addr_validate(&user)?;
    let mut stats = USER_STATS
        .load(deps.storage, &user_addr)
        .unwrap_or(UserStats {
            total_xp: 0,
            total_coins: 0,
            completed_challenges: 0,
        });

    stats.total_xp += xp;
    stats.total_coins += coins;

    USER_STATS.save(deps.storage, &user_addr, &stats)?;

    Ok(Response::new()
        .add_attribute("action", "reward_user")
        .add_attribute("user", user)
        .add_attribute("xp", xp.to_string())
        .add_attribute("coins", coins.to_string()))
}

pub fn execute_mint_nft(
    deps: DepsMut,
    info: MessageInfo,
    user: String,
    achievement_id: String,
    ipfs_uri: String,
) -> Result<Response, ContractError> {
    let owner = OWNER.load(deps.storage)?;
    if info.sender != owner {
        return Err(ContractError::Unauthorized {});
    }

    let user_addr = deps.api.addr_validate(&user)?;

    // Emitting transaction log attributes for NFT achievement tracking.
    Ok(Response::new()
        .add_attribute("action", "mint_achievement_nft")
        .add_attribute("recipient", user_addr.to_string())
        .add_attribute("achievement_id", achievement_id)
        .add_attribute("ipfs_uri", ipfs_uri))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetChallenge { id } => to_binary(&query_challenge(deps, id)?),
        QueryMsg::GetUserStats { user } => to_binary(&query_user_stats(deps, user)?),
    }
}

fn query_challenge(deps: Deps, id: String) -> StdResult<ChallengeResponse> {
    let challenge = CHALLENGES.load(deps.storage, &id)?;
    Ok(ChallengeResponse {
        id: challenge.id,
        creator: challenge.creator.to_string(),
        difficulty: challenge.difficulty,
        reward_xp: challenge.reward_xp,
        reward_coins: challenge.reward_coins,
        completed: challenge.completed,
        completion_date: challenge.completion_date,
        proof_hash: challenge.proof_hash,
    })
}

fn query_user_stats(deps: Deps, user: String) -> StdResult<UserStatsResponse> {
    let user_addr = deps.api.addr_validate(&user)?;
    let stats = USER_STATS
        .load(deps.storage, &user_addr)
        .unwrap_or(UserStats {
            total_xp: 0,
            total_coins: 0,
            completed_challenges: 0,
        });

    Ok(UserStatsResponse {
        user,
        total_xp: stats.total_xp,
        total_coins: stats.total_coins,
        completed_challenges: stats.completed_challenges,
    })
}
