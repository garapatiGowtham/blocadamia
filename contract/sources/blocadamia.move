module blocadamia_addr::blocadamia {
    use std::signer;
    use std::vector;
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use std::timestamp;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_std::table::{Self, Table};
    use aptos_std::type_info;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;
    const E_LOAN_NOT_FOUND: u64 = 4;
    const E_LOAN_ALREADY_APPROVED: u64 = 5;
    const E_NOT_LOAN_LENDER: u64 = 6;
    const E_LOAN_NOT_APPROVED: u64 = 7;
    const E_INVALID_AMOUNT: u64 = 8;
    const E_BUDGET_TOTAL_EXCEEDS_100: u64 = 9;
    const E_USER_NOT_FOUND: u64 = 10;

    // Budget categories
    const CATEGORY_FOOD: u8 = 1;
    const CATEGORY_RENT: u8 = 2;
    const CATEGORY_TRAVEL: u8 = 3;
    const CATEGORY_ENTERTAINMENT: u8 = 4;
    const CATEGORY_EDUCATION: u8 = 5;
    const CATEGORY_OTHER: u8 = 6;

    // Loan status
    const LOAN_STATUS_PENDING: u8 = 0;
    const LOAN_STATUS_APPROVED: u8 = 1;
    const LOAN_STATUS_REPAID: u8 = 2;
    const LOAN_STATUS_DEFAULTED: u8 = 3;

    // User profile structure
    struct UserProfile has key, store, copy {
        address: address,
        reputation_score: u64,
        total_loans_taken: u64,
        total_loans_given: u64,
        successful_repayments: u64,
        budget: Budget,
        created_at: u64,
    }

    // Budget allocation structure
    struct Budget has store, copy, drop {
        food_percent: u8,
        rent_percent: u8,
        travel_percent: u8,
        entertainment_percent: u8,
        education_percent: u8,
        other_percent: u8,
        total_budget: u64,
        last_updated: u64,
    }

    // Loan structure
    struct Loan has store, copy, drop {
        id: u64,
        borrower: address,
        lender: Option<address>,
        amount: u64,
        interest_rate: u64, // basis points (e.g., 500 = 5%)
        duration_days: u64,
        status: u8,
        created_at: u64,
        approved_at: Option<u64>,
        repaid_at: Option<u64>,
        description: String,
    }

    // Transaction record
    struct TransactionRecord has store, copy, drop {
        id: u64,
        from: address,
        to: address,
        amount: u64,
        transaction_type: String,
        timestamp: u64,
        description: String,
    }

    // Platform state
    struct PlatformState has key {
        users: Table<address, UserProfile>,
        loans: Table<u64, Loan>,
        transactions: vector<TransactionRecord>,
        next_loan_id: u64,
        next_transaction_id: u64,
        total_users: u64,
        total_loans: u64,
        total_volume: u64,
    }

    // Events
    struct UserRegisteredEvent has drop, store {
        user_address: address,
        timestamp: u64,
    }

    struct LoanRequestedEvent has drop, store {
        loan_id: u64,
        borrower: address,
        amount: u64,
        timestamp: u64,
    }

    struct LoanApprovedEvent has drop, store {
        loan_id: u64,
        lender: address,
        timestamp: u64,
    }

    struct LoanRepaidEvent has drop, store {
        loan_id: u64,
        borrower: address,
        amount: u64,
        timestamp: u64,
    }

    struct BudgetUpdatedEvent has drop, store {
        user_address: address,
        timestamp: u64,
    }

    struct PaymentMadeEvent has drop, store {
        from: address,
        to: address,
        amount: u64,
        timestamp: u64,
    }

    // Event handles
    struct EventHandles has key {
        user_registered_events: EventHandle<UserRegisteredEvent>,
        loan_requested_events: EventHandle<LoanRequestedEvent>,
        loan_approved_events: EventHandle<LoanApprovedEvent>,
        loan_repaid_events: EventHandle<LoanRepaidEvent>,
        budget_updated_events: EventHandle<BudgetUpdatedEvent>,
        payment_made_events: EventHandle<PaymentMadeEvent>,
    }

    // Initialize the platform (call this once during deployment)
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<PlatformState>(admin_addr), E_ALREADY_INITIALIZED);

        move_to(admin, PlatformState {
            users: table::new(),
            loans: table::new(),
            transactions: vector::empty(),
            next_loan_id: 1,
            next_transaction_id: 1,
            total_users: 0,
            total_loans: 0,
            total_volume: 0,
        });

        move_to(admin, EventHandles {
            user_registered_events: account::new_event_handle<UserRegisteredEvent>(admin),
            loan_requested_events: account::new_event_handle<LoanRequestedEvent>(admin),
            loan_approved_events: account::new_event_handle<LoanApprovedEvent>(admin),
            loan_repaid_events: account::new_event_handle<LoanRepaidEvent>(admin),
            budget_updated_events: account::new_event_handle<BudgetUpdatedEvent>(admin),
            payment_made_events: account::new_event_handle<PaymentMadeEvent>(admin),
        });
    }

    // Register a new user
    public entry fun register_user(user: &signer, admin_addr: address) acquires PlatformState, EventHandles {
        let user_addr = signer::address_of(user);
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);

        let platform_state = borrow_global_mut<PlatformState>(admin_addr);
        
        let user_profile = UserProfile {
            address: user_addr,
            reputation_score: 100, // Starting reputation
            total_loans_taken: 0,
            total_loans_given: 0,
            successful_repayments: 0,
            budget: Budget {
                food_percent: 30,
                rent_percent: 40,
                travel_percent: 10,
                entertainment_percent: 10,
                education_percent: 5,
                other_percent: 5,
                total_budget: 0,
                last_updated: timestamp::now_seconds(),
            },
            created_at: timestamp::now_seconds(),
        };

        table::add(&mut platform_state.users, user_addr, user_profile);
        platform_state.total_users = platform_state.total_users + 1;

        // Emit event
        let event_handles = borrow_global_mut<EventHandles>(admin_addr);
        event::emit_event(&mut event_handles.user_registered_events, UserRegisteredEvent {
            user_address: user_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Update budget allocation
    public entry fun update_budget(
        user: &signer,
        admin_addr: address,
        food_percent: u8,
        rent_percent: u8,
        travel_percent: u8,
        entertainment_percent: u8,
        education_percent: u8,
        other_percent: u8,
        total_budget: u64
    ) acquires PlatformState, EventHandles {
        let user_addr = signer::address_of(user);
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);

        let total_percent = (food_percent as u64) + (rent_percent as u64) + (travel_percent as u64) + 
                           (entertainment_percent as u64) + (education_percent as u64) + (other_percent as u64);
        assert!(total_percent == 100, E_BUDGET_TOTAL_EXCEEDS_100);

        let platform_state = borrow_global_mut<PlatformState>(admin_addr);
        assert!(table::contains(&platform_state.users, user_addr), E_USER_NOT_FOUND);

        let user_profile = table::borrow_mut(&mut platform_state.users, user_addr);
        user_profile.budget = Budget {
            food_percent,
            rent_percent,
            travel_percent,
            entertainment_percent,
            education_percent,
            other_percent,
            total_budget,
            last_updated: timestamp::now_seconds(),
        };

        // Emit event
        let event_handles = borrow_global_mut<EventHandles>(admin_addr);
        event::emit_event(&mut event_handles.budget_updated_events, BudgetUpdatedEvent {
            user_address: user_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Request a loan
    public entry fun request_loan(
        borrower: &signer,
        admin_addr: address,
        amount: u64,
        interest_rate: u64,
        duration_days: u64,
        description: String
    ) acquires PlatformState, EventHandles {
        let borrower_addr = signer::address_of(borrower);
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);

        let platform_state = borrow_global_mut<PlatformState>(admin_addr);
        assert!(table::contains(&platform_state.users, borrower_addr), E_USER_NOT_FOUND);

        let loan_id = platform_state.next_loan_id;
        let loan = Loan {
            id: loan_id,
            borrower: borrower_addr,
            lender: option::none(),
            amount,
            interest_rate,
            duration_days,
            status: LOAN_STATUS_PENDING,
            created_at: timestamp::now_seconds(),
            approved_at: option::none(),
            repaid_at: option::none(),
            description,
        };

        table::add(&mut platform_state.loans, loan_id, loan);
        platform_state.next_loan_id = loan_id + 1;
        platform_state.total_loans = platform_state.total_loans + 1;

        // Emit event
        let event_handles = borrow_global_mut<EventHandles>(admin_addr);
        event::emit_event(&mut event_handles.loan_requested_events, LoanRequestedEvent {
            loan_id,
            borrower: borrower_addr,
            amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Approve and fund a loan
    public entry fun approve_loan(
        lender: &signer,
        admin_addr: address,
        loan_id: u64
    ) acquires PlatformState, EventHandles {
        let lender_addr = signer::address_of(lender);
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);

        let platform_state = borrow_global_mut<PlatformState>(admin_addr);
        assert!(table::contains(&platform_state.loans, loan_id), E_LOAN_NOT_FOUND);
        assert!(table::contains(&platform_state.users, lender_addr), E_USER_NOT_FOUND);

        let loan = table::borrow_mut(&mut platform_state.loans, loan_id);
        assert!(loan.status == LOAN_STATUS_PENDING, E_LOAN_ALREADY_APPROVED);

        // Transfer funds from lender to borrower
        let amount = loan.amount;
        coin::transfer<AptosCoin>(lender, loan.borrower, amount);

        // Update loan status
        loan.lender = option::some(lender_addr);
        loan.status = LOAN_STATUS_APPROVED;
        loan.approved_at = option::some(timestamp::now_seconds());

        // Update user profiles
        let lender_profile = table::borrow_mut(&mut platform_state.users, lender_addr);
        lender_profile.total_loans_given = lender_profile.total_loans_given + 1;

        let borrower_profile = table::borrow_mut(&mut platform_state.users, loan.borrower);
        borrower_profile.total_loans_taken = borrower_profile.total_loans_taken + 1;

        platform_state.total_volume = platform_state.total_volume + amount;

        // Record transaction
        let transaction_id = platform_state.next_transaction_id;
        let transaction = TransactionRecord {
            id: transaction_id,
            from: lender_addr,
            to: loan.borrower,
            amount,
            transaction_type: string::utf8(b"loan_disbursement"),
            timestamp: timestamp::now_seconds(),
            description: string::utf8(b"Loan disbursement"),
        };
        vector::push_back(&mut platform_state.transactions, transaction);
        platform_state.next_transaction_id = transaction_id + 1;

        // Emit event
        let event_handles = borrow_global_mut<EventHandles>(admin_addr);
        event::emit_event(&mut event_handles.loan_approved_events, LoanApprovedEvent {
            loan_id,
            lender: lender_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Repay a loan
    public entry fun repay_loan(
        borrower: &signer,
        admin_addr: address,
        loan_id: u64
    ) acquires PlatformState, EventHandles {
        let borrower_addr = signer::address_of(borrower);
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);

        let platform_state = borrow_global_mut<PlatformState>(admin_addr);
        assert!(table::contains(&platform_state.loans, loan_id), E_LOAN_NOT_FOUND);

        let loan = table::borrow_mut(&mut platform_state.loans, loan_id);
        assert!(loan.status == LOAN_STATUS_APPROVED, E_LOAN_NOT_APPROVED);
        assert!(loan.borrower == borrower_addr, E_NOT_LOAN_LENDER);

        let lender_addr = *option::borrow(&loan.lender);
        
        // Calculate repayment amount with interest
        let principal = loan.amount;
        let interest = (principal * loan.interest_rate) / 10000; // basis points
        let total_repayment = principal + interest;

        // Transfer repayment from borrower to lender
        coin::transfer<AptosCoin>(borrower, lender_addr, total_repayment);

        // Update loan status
        loan.status = LOAN_STATUS_REPAID;
        loan.repaid_at = option::some(timestamp::now_seconds());

        // Update borrower reputation
        let borrower_profile = table::borrow_mut(&mut platform_state.users, borrower_addr);
        borrower_profile.successful_repayments = borrower_profile.successful_repayments + 1;
        borrower_profile.reputation_score = borrower_profile.reputation_score + 10;

        platform_state.total_volume = platform_state.total_volume + total_repayment;

        // Record transaction
        let transaction_id = platform_state.next_transaction_id;
        let transaction = TransactionRecord {
            id: transaction_id,
            from: borrower_addr,
            to: lender_addr,
            amount: total_repayment,
            transaction_type: string::utf8(b"loan_repayment"),
            timestamp: timestamp::now_seconds(),
            description: string::utf8(b"Loan repayment"),
        };
        vector::push_back(&mut platform_state.transactions, transaction);
        platform_state.next_transaction_id = transaction_id + 1;

        // Emit event
        let event_handles = borrow_global_mut<EventHandles>(admin_addr);
        event::emit_event(&mut event_handles.loan_repaid_events, LoanRepaidEvent {
            loan_id,
            borrower: borrower_addr,
            amount: total_repayment,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Make a payment
    public entry fun make_payment(
        sender: &signer,
        admin_addr: address,
        recipient: address,
        amount: u64,
        description: String
    ) acquires PlatformState, EventHandles {
        let sender_addr = signer::address_of(sender);
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);

        // Transfer coins
        coin::transfer<AptosCoin>(sender, recipient, amount);

        let platform_state = borrow_global_mut<PlatformState>(admin_addr);
        platform_state.total_volume = platform_state.total_volume + amount;

        // Record transaction
        let transaction_id = platform_state.next_transaction_id;
        let transaction = TransactionRecord {
            id: transaction_id,
            from: sender_addr,
            to: recipient,
            amount,
            transaction_type: string::utf8(b"payment"),
            timestamp: timestamp::now_seconds(),
            description,
        };
        vector::push_back(&mut platform_state.transactions, transaction);
        platform_state.next_transaction_id = transaction_id + 1;

        // Emit event
        let event_handles = borrow_global_mut<EventHandles>(admin_addr);
        event::emit_event(&mut event_handles.payment_made_events, PaymentMadeEvent {
            from: sender_addr,
            to: recipient,
            amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    // View functions
    #[view]
    public fun get_user_profile(admin_addr: address, user_addr: address): UserProfile acquires PlatformState {
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        let platform_state = borrow_global<PlatformState>(admin_addr);
        assert!(table::contains(&platform_state.users, user_addr), E_USER_NOT_FOUND);
        *table::borrow(&platform_state.users, user_addr)
    }

    #[view]
    public fun get_loan(admin_addr: address, loan_id: u64): Loan acquires PlatformState {
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        let platform_state = borrow_global<PlatformState>(admin_addr);
        assert!(table::contains(&platform_state.loans, loan_id), E_LOAN_NOT_FOUND);
        *table::borrow(&platform_state.loans, loan_id)
    }

    #[view]
    public fun get_platform_stats(admin_addr: address): (u64, u64, u64) acquires PlatformState {
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        let platform_state = borrow_global<PlatformState>(admin_addr);
        (platform_state.total_users, platform_state.total_loans, platform_state.total_volume)
    }

    #[view]
    public fun get_user_loans_as_borrower(admin_addr: address, user_addr: address): vector<u64> acquires PlatformState {
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        let platform_state = borrow_global<PlatformState>(admin_addr);
        
        let loan_ids = vector::empty<u64>();
        let i = 1;
        while (i < platform_state.next_loan_id) {
            if (table::contains(&platform_state.loans, i)) {
                let loan = table::borrow(&platform_state.loans, i);
                if (loan.borrower == user_addr) {
                    vector::push_back(&mut loan_ids, i);
                };
            };
            i = i + 1;
        };
        loan_ids
    }

    #[view]
    public fun get_user_loans_as_lender(admin_addr: address, user_addr: address): vector<u64> acquires PlatformState {
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        let platform_state = borrow_global<PlatformState>(admin_addr);
        
        let loan_ids = vector::empty<u64>();
        let i = 1;
        while (i < platform_state.next_loan_id) {
            if (table::contains(&platform_state.loans, i)) {
                let loan = table::borrow(&platform_state.loans, i);
                if (option::is_some(&loan.lender) && *option::borrow(&loan.lender) == user_addr) {
                    vector::push_back(&mut loan_ids, i);
                };
            };
            i = i + 1;
        };
        loan_ids
    }

    #[view]
    public fun get_available_loans(admin_addr: address): vector<u64> acquires PlatformState {
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        let platform_state = borrow_global<PlatformState>(admin_addr);
        
        let loan_ids = vector::empty<u64>();
        let i = 1;
        while (i < platform_state.next_loan_id) {
            if (table::contains(&platform_state.loans, i)) {
                let loan = table::borrow(&platform_state.loans, i);
                if (loan.status == LOAN_STATUS_PENDING) {
                    vector::push_back(&mut loan_ids, i);
                };
            };
            i = i + 1;
        };
        loan_ids
    }

    #[view]
    public fun calculate_reputation_score(admin_addr: address, user_addr: address): u64 acquires PlatformState {
        assert!(exists<PlatformState>(admin_addr), E_NOT_INITIALIZED);
        let platform_state = borrow_global<PlatformState>(admin_addr);
        assert!(table::contains(&platform_state.users, user_addr), E_USER_NOT_FOUND);
        
        let user_profile = table::borrow(&platform_state.users, user_addr);
        let base_score = user_profile.reputation_score;
        
        // Bonus for successful repayments
        let repayment_bonus = user_profile.successful_repayments * 5;
        
        // Bonus for being a lender
        let lending_bonus = user_profile.total_loans_given * 2;
        
        base_score + repayment_bonus + lending_bonus
    }
}
