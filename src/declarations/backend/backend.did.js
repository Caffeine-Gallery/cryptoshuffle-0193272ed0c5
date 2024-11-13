export const idlFactory = ({ IDL }) => {
  const CryptoData = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'lastUpdated' : IDL.Int,
    'price' : IDL.Float64,
    'symbol' : IDL.Text,
  });
  return IDL.Service({
    'getCryptoData' : IDL.Func([], [IDL.Vec(CryptoData)], ['query']),
    'updateCryptoData' : IDL.Func([IDL.Vec(CryptoData)], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
