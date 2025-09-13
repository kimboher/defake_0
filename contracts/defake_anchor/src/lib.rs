use near_sdk::{env, near_bindgen, AccountId, NearToken, PanicOnDefault, Promise};
use near_sdk::json_types::U128;
use borsh::{BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    owner: AccountId,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner: AccountId) -> Self {
        Self { owner }
    }

    /// Near-free interaction; requires exactly 1 yoctoNEAR (safety guard).
    #[payable]
    pub fn poke(&mut self) {
        assert_eq!(
            env::attached_deposit(),
            NearToken::from_yoctonear(1),
            "attach exactly 1 yoctoNEAR"
        );
        let caller = env::predecessor_account_id();
        env::log_str(&format!("POKE:{}:{}", caller, env::block_timestamp()));
    }

    /// Anchor a response hash for integrity (sid=session/questionnaire id).
    #[payable]
    pub fn attest_response(&mut self, sid: String, hash: String) {
        assert_eq!(
            env::attached_deposit(),
            NearToken::from_yoctonear(1),
            "attach exactly 1 yoctoNEAR"
        );
        let caller = env::predecessor_account_id();
        env::log_str(&format!("ATTEST:{}:{}:{}", sid, hash, caller));
    }

    /// Optional: accept a payment/tip to the project account (counts as transfer+call).
    #[payable]
    pub fn tip(&mut self) {
        let caller = env::predecessor_account_id();
        let yocto = env::attached_deposit().as_yoctonear();
        env::log_str(&format!("TIP:{}:{}", caller, yocto));
    }

    /// Deposit NEAR to the contract/account; owner can later pay testers from it.
    #[payable]
    pub fn fund_pool(&mut self) {
        let caller = env::predecessor_account_id();
        let yocto = env::attached_deposit().as_yoctonear();
        env::log_str(&format!("FUND:{}:{}", caller, yocto));
    }

    /// Owner-only payout of raw yoctoNEAR to a tester's account.
    pub fn pay(&mut self, to: AccountId, amount: U128) {
        assert_eq!(env::predecessor_account_id(), self.owner, "Only owner");
        Promise::new(to).transfer(NearToken::from_yoctonear(amount.0));
    }

    /// Owner-only batch payout.
    pub fn pay_many(&mut self, tos: Vec<AccountId>, amounts: Vec<U128>) {
        assert_eq!(env::predecessor_account_id(), self.owner, "Only owner");
        assert_eq!(tos.len(), amounts.len(), "Length mismatch");
        for (i, to) in tos.into_iter().enumerate() {
            Promise::new(to).transfer(NearToken::from_yoctonear(amounts[i].0));
        }
    }

    // Views
    pub fn version(&self) -> String { "0.1.0".into() }
    pub fn get_owner(&self) -> AccountId { self.owner.clone() }
}