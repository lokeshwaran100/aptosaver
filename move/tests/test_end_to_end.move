#[test_only]
module aptosaver_addr::test_end_to_end {
    use std::signer;
    use std::vector;

    use aptos_framework::account;
    use aptosaver_addr::aptosaver;

    #[test(
        admin = @aptosaver_addr,
        user1 = @0x101,
        user2 = @0x102
    )]
    fun test_deposit_and_withdraw(
        admin: &signer,
        user1: &signer,
        user2: &signer,
    ) {
        let admin_addr = signer::address_of(admin);
        let user1_addr = signer::address_of(user1);
        let user2_addr = signer::address_of(user2);

        // Create accounts for testing
        account::create_account_for_test(admin_addr);
        account::create_account_for_test(user1_addr);
        account::create_account_for_test(user2_addr);

        // Initialize admin data for testing
        aptosaver::init_for_test(admin);

        // Test deposit
        let deposit_amount = 1000;
        aptosaver::deposit_for_test(admin, user1, deposit_amount);

        // Test another deposit from different user
        let deposit_amount2 = 2000;
        aptosaver::deposit_for_test(admin, user2, deposit_amount2);

        // Test partial withdrawal
        let withdraw_amount = 500;
        aptosaver::withdraw_for_test(admin, user1, withdraw_amount);

        // Test full withdrawal
        let remaining_amount = 500;
        aptosaver::withdraw_for_test(admin, user1, remaining_amount);
    }

    #[test(
        admin = @aptosaver_addr,
        user1 = @0x101,
        user2 = @0x102
    )]
    fun test_lottery_system(
        admin: &signer,
        user1: &signer,
        user2: &signer,
    ) {
        let admin_addr = signer::address_of(admin);
        let user1_addr = signer::address_of(user1);
        let user2_addr = signer::address_of(user2);

        // Create accounts for testing
        account::create_account_for_test(admin_addr);
        account::create_account_for_test(user1_addr);
        account::create_account_for_test(user2_addr);

        // Initialize admin data for testing
        aptosaver::init_for_test(admin);

        // Make deposits to be eligible for lottery
        aptosaver::deposit_for_test(admin, user1, 1000);
        aptosaver::deposit_for_test(admin, user2, 2000);

        // Create eligible users vector
        let eligible_users = vector::empty<address>();
        vector::push_back(&mut eligible_users, user1_addr);
        vector::push_back(&mut eligible_users, user2_addr);

        // Pick a winner (using test function with deterministic winner selection)
        let lottery_amount = 100;
        let winner_index = 0; // Select first user as winner for testing
        aptosaver::pick_winner_for_test(admin, eligible_users, lottery_amount, winner_index);

        // Check lottery winner
        let winner = aptosaver::lottery_winner();
        let lottery_prize = aptosaver::lottery();
        
        // Winner should be user1 (index 0)
        assert!(winner == user1_addr, 1);
        assert!(lottery_prize == lottery_amount, 2);

        // Test claim functionality
        aptosaver::claim_for_test(admin, user1);

        // After claiming, lottery should be reset
        let new_lottery_amount = aptosaver::lottery();
        assert!(new_lottery_amount == 0, 3);
    }

    #[test(
        admin = @aptosaver_addr,
        user1 = @0x101
    )]
    #[expected_failure(abort_code = 3, location = aptosaver)]
    fun test_withdraw_without_deposit(
        admin: &signer,
        user1: &signer,
    ) {
        let admin_addr = signer::address_of(admin);
        let user1_addr = signer::address_of(user1);

        // Create accounts for testing
        account::create_account_for_test(admin_addr);
        account::create_account_for_test(user1_addr);

        // Initialize admin data for testing
        aptosaver::init_for_test(admin);

        // Try to withdraw without any deposit - should fail
        aptosaver::withdraw_for_test(admin, user1, 100);
    }

    #[test(
        admin = @aptosaver_addr,
        user1 = @0x101
    )]
    #[expected_failure(abort_code = 4, location = aptosaver)]
    fun test_withdraw_more_than_deposited(
        admin: &signer,
        user1: &signer,
    ) {
        let admin_addr = signer::address_of(admin);
        let user1_addr = signer::address_of(user1);

        // Create accounts for testing
        account::create_account_for_test(admin_addr);
        account::create_account_for_test(user1_addr);

        // Initialize admin data for testing
        aptosaver::init_for_test(admin);

        // Deposit some amount
        aptosaver::deposit_for_test(admin, user1, 500);

        // Try to withdraw more than deposited - should fail
        aptosaver::withdraw_for_test(admin, user1, 1000);
    }

    #[test(
        admin = @aptosaver_addr,
        user1 = @0x101
    )]
    fun test_lottery_winner_check(
        admin: &signer,
        user1: &signer,
    ) {
        let admin_addr = signer::address_of(admin);
        let user1_addr = signer::address_of(user1);

        // Create accounts for testing
        account::create_account_for_test(admin_addr);
        account::create_account_for_test(user1_addr);

        // Initialize admin data for testing
        aptosaver::init_for_test(admin);

        // Initially, user1 should not be lottery winner
        let is_winner = aptosaver::is_lottery_winner(admin_addr, user1_addr);
        assert!(!is_winner, 1);

        // Make user eligible and pick as winner
        let eligible_users = vector::empty<address>();
        vector::push_back(&mut eligible_users, user1_addr);
        
        aptosaver::pick_winner_for_test(admin, eligible_users, 500, 0);

        // Now user1 should be the lottery winner
        let is_winner_after = aptosaver::is_lottery_winner(admin_addr, user1_addr);
        assert!(is_winner_after, 2);
    }
}