import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CryptoData {
  'id' : string,
  'name' : string,
  'lastUpdated' : bigint,
  'price' : number,
  'symbol' : string,
}
export interface _SERVICE {
  'getCryptoData' : ActorMethod<[], Array<CryptoData>>,
  'updateCryptoData' : ActorMethod<[Array<CryptoData>], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
