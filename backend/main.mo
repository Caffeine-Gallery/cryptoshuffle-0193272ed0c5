import Blob "mo:base/Blob";
import Float "mo:base/Float";
import Func "mo:base/Func";

import Timer "mo:base/Timer";
import Random "mo:base/Random";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Iter "mo:base/Iter";

actor {
    // Type for storing crypto data
    type CryptoData = {
        id: Text;
        symbol: Text;
        name: Text;
        price: Float;
        lastUpdated: Int;
    };

    // Stable variable to store current crypto data
    stable var cryptoData : [CryptoData] = [];
    
    // Timer ID for periodic updates
    stable var timerId : Nat = 0;

    // Function to generate random indices
    private func generateRandomIndices(seed: Blob, max: Nat, count: Nat) : [Nat] {
        let random = Random.Finite(seed);
        var indices : [var Nat] = Array.init<Nat>(count, 0);
        
        var i = 0;
        while (i < count) {
            switch (random.byte()) {
                case (?val) {
                    // Convert Nat8 to Nat and ensure it's within range
                    let randomNum = Nat8.toNat(val);
                    let index = randomNum % max;
                    indices[i] := index;
                };
                case (null) {
                    // Fallback value if random generation fails
                    indices[i] := i % max;
                };
            };
            i += 1;
        };
        
        Array.freeze(indices)
    };

    // Update crypto data
    public func updateCryptoData(newData: [CryptoData]) : async () {
        cryptoData := newData;
    };

    // Get current crypto data
    public query func getCryptoData() : async [CryptoData] {
        cryptoData
    };

    // System functions for upgrade safety
    system func preupgrade() {
        // Data is already in stable storage
    };

    system func postupgrade() {
        // Start the timer after upgrade
        timerId := Timer.setTimer(#seconds 0, func() : async () {
            // Timer logic would go here, but actual API calls will be handled by frontend
            Debug.print("Timer triggered");
        });
    };
}
