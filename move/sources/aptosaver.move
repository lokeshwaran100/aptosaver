module aptosaver_addr::aptosaver {
    use std::error;
    use std::signer;
    // use std::string;
    use aptos_framework::event;
    use aptos_framework::randomness;
    use std::vector;

    //:!:>resource
    struct AdminData has key {
        deposits: u64,
        winner: address,
        lottery: u64
    }
    //<:!:resource

    //:!:>resource
    struct UserData has key {
        deposits: u64
    }
    //<:!:resource

    #[event]
    struct Deposited has drop, store {
        user: address,
        amount: u64
    }

    #[event]
    struct Withdrawn has drop, store {
        user: address,
        amount: u64
    }

    #[event]
    struct WinnerPicked has drop, store {
        user: address,
        amount: u64
    }

    #[event]
    struct Claimed has drop, store {
        user: address,
        amount: u64
    }

    /// There is no message present
    const ENO_MESSAGE: u64 = 0;

    const NO_ADMIN_DATA: u64 = 1;

    const ADMIN_DATA_INITIALIZES: u64 = 2;

    const NO_DEPOSITS_TO_WITHDRAW: u64 = 3;

    const WITHDRAW_AMOUNT_EXCEDDED: u64 = 4;

    fun init_module(admin: signer) {
        let admin_addr = signer::address_of(&admin);
        // assert!(!exists<AdminData>(admin_addr), error::not_found(ADMIN_DATA_INITIALIZES));
        move_to(&admin, AdminData {
            deposits: 0,
            winner: admin_addr,
            lottery: 0});
    }

    public entry fun deposit(admin: signer, user: signer, amount: u64)
    acquires AdminData, UserData {
        let user_addr = signer::address_of(&user);
        if(!exists<UserData>(user_addr)){
            move_to(&user, UserData { deposits: amount });
        } else {
            let user_data = borrow_global_mut<UserData>(user_addr);
            user_data.deposits = user_data.deposits + amount;
        };

        let admin_addr = signer::address_of(&admin);
        assert!(exists<AdminData>(admin_addr), error::not_found(NO_ADMIN_DATA));
        let admin_data = borrow_global_mut<AdminData>(admin_addr);
        admin_data.deposits = admin_data.deposits + amount;
        
        event::emit(Deposited {
            user: user_addr,
            amount: amount
        });
    }

    public entry fun withdraw(admin: signer, user: signer, amount: u64)
    acquires AdminData, UserData {
        let user_addr = signer::address_of(&user);
        assert!(exists<UserData>(user_addr), error::not_found(NO_DEPOSITS_TO_WITHDRAW));
        
        let user_data = borrow_global_mut<UserData>(user_addr);
        assert!(user_data.deposits >= amount, error::not_found(WITHDRAW_AMOUNT_EXCEDDED));
        user_data.deposits = user_data.deposits - amount;

        let admin_addr = signer::address_of(&admin);
        assert!(exists<AdminData>(admin_addr), error::not_found(NO_ADMIN_DATA));
        let admin_data = borrow_global_mut<AdminData>(admin_addr);
        admin_data.deposits = admin_data.deposits - amount;
        
        event::emit(Withdrawn {
            user: user_addr,
            amount: amount
        });
    }

    #[randomness]
    entry fun pick_winner(admin: signer, eligible_users: vector<address>, amount: u64)
    acquires AdminData {
        let to: u64 = vector::length(&eligible_users) - 1;
        let winning_number: u64 = randomness::u64_range(0, to);
        
        let admin_addr = signer::address_of(&admin);
        let admin_data = borrow_global_mut<AdminData>(admin_addr);
        let winner = vector::borrow(&eligible_users, winning_number);
        admin_data.winner = *winner;
        admin_data.lottery = amount;

        event::emit(WinnerPicked {
            user: *winner,
            amount: amount
        });
    }

    public entry fun claim(admin: signer, user: signer)
    acquires AdminData {
        let user_addr = signer::address_of(&user);
        let admin_addr = signer::address_of(&admin);
        assert!(exists<AdminData>(admin_addr), error::not_found(NO_ADMIN_DATA));

        let admin_data = borrow_global_mut<AdminData>(admin_addr);
        assert!(admin_data.winner == user_addr, error::not_found(NO_DEPOSITS_TO_WITHDRAW));
        
        event::emit(Claimed {
            user: admin_data.winner,
            amount: admin_data.lottery
        });

        admin_data.winner = admin_addr;
        admin_data.lottery = 0;
    }

    #[view]
    public fun is_lottery_winner(admin_addr: address, user: address): bool
    acquires AdminData {
        assert!(exists<AdminData>(admin_addr), error::not_found(ENO_MESSAGE));
        borrow_global<AdminData>(admin_addr).winner == user
    }

    #[view]
    public fun lottery_winner(): address
    acquires AdminData {
        assert!(exists<AdminData>(@aptosaver_addr), error::not_found(ENO_MESSAGE));
        borrow_global<AdminData>(@aptosaver_addr).winner
    }

    #[view]
    public fun lottery(): u64
    acquires AdminData {
        assert!(exists<AdminData>(@aptosaver_addr), error::not_found(ENO_MESSAGE));
        borrow_global<AdminData>(@aptosaver_addr).lottery
    }

    // #[test(account = @0x1)]
    // public entry fun sender_can_set_message(account: signer) acquires MessageHolder {
    //     let addr = signer::address_of(&account);
    //     aptos_framework::account::create_account_for_test(addr);
    //     set_message(account, string::utf8(b"Hello, Blockchain"));

    //     assert!(
    //         get_message(addr) == string::utf8(b"Hello, Blockchain"),
    //         ENO_MESSAGE
    //     );
    // }
}