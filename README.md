cointainer
==========

A wrapper to bitcoind to provide caching, access control, key management, and other features. Its intended use is an internal service to a web application that manages bitcoin balances for users.

### Setup

Edit the values in config.json to specify the port to listen to for API requests,
the host and port for bitcoind, and other important values.

```
$ npm start
```

### API


#### Balance
Retrieve the current valid coin balance for the given username.

`balance(account_name)`

```
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "balance",
    "params": [
        "bob"
    ]
}
```

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
Create an account for username. This is a prerequisite to receive coins.
The bitcoin receiving address for this user is returned.

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

### History

The project began when json-rpc response times from bitcoind were often 500ms. A project required quick balances and transaction history to build html pages of account information.

### Internals

There are three blocks in the system, this nodejs server, bitcoind, and a database.