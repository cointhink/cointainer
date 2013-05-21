cointainer
==========

A wrapper to bitcoind to provide caching, access control, key management, and other features.


### API


#### Balance
  `balance(account_name)`

```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "now": 1369153449779,
        "username": "bob",
        "balance": {
            "amount": 3,
            "currency": "btc"
        }
    }
}
```

#### AddUser
  `add_user(username)`

```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "now": 1369153371028,
        "username": "bob",
        "receiving_addresss": "1Q3gZkgrcr9AELaZ2mUTCeh66fH9iH5uSK"
    }
}
```

### Internals

The project began when json-rpc response times from bitcoind were often 500ms. A project required quick balances and transaction history to build html pages of account information.

There are three blocks in the system, this nodejs server, bitcoind, and a database.