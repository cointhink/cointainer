cointainer
==========

A wrapper to bitcoind to provide caching, access control, key management, and other features.


### API


#### Balance
  balance(account_name)

#### ReceivingAddress
  receiving_address(account_name)


### Internals

The project began when json-rpc response times from bitcoind were often 500ms. A project required quick balances and transaction history to build html pages of account information.

There are three blocks in the system, this nodejs server, bitcoind, and a database.