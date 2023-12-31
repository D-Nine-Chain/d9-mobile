export const ammContractABI = {
   "source": {
      "hash": "0xbcc8e7f43c8369a98596e1f4a3f6574934a35ea90f47fc4c740dbfa0ecec0752",
      "language": "ink! 4.3.0",
      "compiler": "rustc 1.72.0",
      "build_info": {
         "build_mode": "Release",
         "cargo_contract_version": "3.2.0",
         "rust_toolchain": "stable-aarch64-apple-darwin",
         "wasm_opt_settings": {
            "keep_debug_symbols": false,
            "optimization_passes": "Z"
         }
      }
   },
   "contract": {
      "name": "market-maker",
      "version": "0.1.0",
      "authors": [
         "D9Dev"
      ]
   },
   "spec": {
      "constructors": [
         {
            "args": [
               {
                  "label": "usdt_contract",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 0
                  }
               },
               {
                  "label": "fee_percent",
                  "type": {
                     "displayName": [
                        "u32"
                     ],
                     "type": 3
                  }
               },
               {
                  "label": "liquidity_tolerance_percent",
                  "type": {
                     "displayName": [
                        "u32"
                     ],
                     "type": 3
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "new",
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink_primitives",
                  "ConstructorResult"
               ],
               "type": 5
            },
            "selector": "0x9bae9d5e"
         }
      ],
      "docs": [],
      "environment": {
         "accountId": {
            "displayName": [
               "AccountId"
            ],
            "type": 0
         },
         "balance": {
            "displayName": [
               "Balance"
            ],
            "type": 4
         },
         "blockNumber": {
            "displayName": [
               "BlockNumber"
            ],
            "type": 3
         },
         "chainExtension": {
            "displayName": [
               "ChainExtension"
            ],
            "type": 23
         },
         "hash": {
            "displayName": [
               "Hash"
            ],
            "type": 22
         },
         "maxEventTopics": 4,
         "timestamp": {
            "displayName": [
               "Timestamp"
            ],
            "type": 21
         }
      },
      "events": [
         {
            "args": [
               {
                  "docs": [],
                  "indexed": true,
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 0
                  }
               },
               {
                  "docs": [],
                  "indexed": true,
                  "label": "direction",
                  "type": {
                     "displayName": [],
                     "type": 20
                  }
               },
               {
                  "docs": [],
                  "indexed": true,
                  "label": "time",
                  "type": {
                     "displayName": [
                        "Timestamp"
                     ],
                     "type": 21
                  }
               }
            ],
            "docs": [],
            "label": "CurrencySwap"
         }
      ],
      "lang_error": {
         "displayName": [
            "ink",
            "LangError"
         ],
         "type": 7
      },
      "messages": [
         {
            "args": [],
            "default": false,
            "docs": [
               " get pool balances (d9, usdt)"
            ],
            "label": "get_currency_reserves",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 8
            },
            "selector": "0x43b2d0e6"
         },
         {
            "args": [
               {
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 0
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "get_liquidity_provider",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 10
            },
            "selector": "0x32e702ad"
         },
         {
            "args": [
               {
                  "label": "usdt_liquidity",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 4
                  }
               }
            ],
            "default": false,
            "docs": [
               " add liquidity by adding tokens to the reserves"
            ],
            "label": "add_liquidity",
            "mutates": true,
            "payable": true,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 12
            },
            "selector": "0x264cd04b"
         },
         {
            "args": [],
            "default": false,
            "docs": [],
            "label": "remove_liquidity",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 12
            },
            "selector": "0xbdd16bfa"
         },
         {
            "args": [
               {
                  "label": "usdt_liquidity",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 4
                  }
               },
               {
                  "label": "d9_liquidity",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 4
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "check_new_liquidity",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 12
            },
            "selector": "0x5a150c03"
         },
         {
            "args": [
               {
                  "label": "usdt",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 4
                  }
               }
            ],
            "default": false,
            "docs": [
               " sell usdt"
            ],
            "label": "get_d9",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 16
            },
            "selector": "0x0edab8e1"
         },
         {
            "args": [],
            "default": false,
            "docs": [
               " sell d9"
            ],
            "label": "get_usdt",
            "mutates": true,
            "payable": true,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 16
            },
            "selector": "0x5b41ab8a"
         },
         {
            "args": [
               {
                  "label": "d9_liquidity",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 4
                  }
               },
               {
                  "label": "usdt_liquidity",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 4
                  }
               }
            ],
            "default": false,
            "docs": [
               " calculate lp tokens based on usdt liquidity"
            ],
            "label": "calc_new_lp_tokens",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 18
            },
            "selector": "0xbdcee4ed"
         },
         {
            "args": [
               {
                  "label": "direction",
                  "type": {
                     "displayName": [
                        "Direction"
                     ],
                     "type": 19
                  }
               },
               {
                  "label": "amount_0",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 4
                  }
               }
            ],
            "default": false,
            "docs": [
               " amount of currency B from A, if A => B"
            ],
            "label": "calculate_exchange",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 16
            },
            "selector": "0x2413eb9a"
         },
         {
            "args": [
               {
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 0
                  }
               },
               {
                  "label": "amount",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 4
                  }
               }
            ],
            "default": false,
            "docs": [
               " check if usdt balance is sufficient for swap"
            ],
            "label": "check_usdt_balance",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 12
            },
            "selector": "0x4a74f8d9"
         }
      ]
   },
   "storage": {
      "root": {
         "layout": {
            "struct": {
               "fields": [
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 0
                        }
                     },
                     "name": "usdt_contract"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 3
                        }
                     },
                     "name": "fee_percent"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 4
                        }
                     },
                     "name": "fee_total"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 3
                        }
                     },
                     "name": "liquidity_tolerance_percent"
                  },
                  {
                     "layout": {
                        "root": {
                           "layout": {
                              "leaf": {
                                 "key": "0x838a4d0c",
                                 "ty": 4
                              }
                           },
                           "root_key": "0x838a4d0c"
                        }
                     },
                     "name": "liquidity_providers"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 4
                        }
                     },
                     "name": "total_lp_tokens"
                  }
               ],
               "name": "MarketMaker"
            }
         },
         "root_key": "0x00000000"
      }
   },
   "types": [
      {
         "id": 0,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "type": 1,
                        "typeName": "[u8; 32]"
                     }
                  ]
               }
            },
            "path": [
               "ink_primitives",
               "types",
               "AccountId"
            ]
         }
      },
      {
         "id": 1,
         "type": {
            "def": {
               "array": {
                  "len": 32,
                  "type": 2
               }
            }
         }
      },
      {
         "id": 2,
         "type": {
            "def": {
               "primitive": "u8"
            }
         }
      },
      {
         "id": 3,
         "type": {
            "def": {
               "primitive": "u32"
            }
         }
      },
      {
         "id": 4,
         "type": {
            "def": {
               "primitive": "u128"
            }
         }
      },
      {
         "id": 5,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 6
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 7
                           }
                        ],
                        "index": 1,
                        "name": "Err"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 6
               },
               {
                  "name": "E",
                  "type": 7
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 6,
         "type": {
            "def": {
               "tuple": []
            }
         }
      },
      {
         "id": 7,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "index": 1,
                        "name": "CouldNotReadInput"
                     }
                  ]
               }
            },
            "path": [
               "ink_primitives",
               "LangError"
            ]
         }
      },
      {
         "id": 8,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 9
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 7
                           }
                        ],
                        "index": 1,
                        "name": "Err"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 9
               },
               {
                  "name": "E",
                  "type": 7
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 9,
         "type": {
            "def": {
               "tuple": [
                  4,
                  4
               ]
            }
         }
      },
      {
         "id": 10,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 11
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 7
                           }
                        ],
                        "index": 1,
                        "name": "Err"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 11
               },
               {
                  "name": "E",
                  "type": 7
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 11,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "index": 0,
                        "name": "None"
                     },
                     {
                        "fields": [
                           {
                              "type": 4
                           }
                        ],
                        "index": 1,
                        "name": "Some"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 4
               }
            ],
            "path": [
               "Option"
            ]
         }
      },
      {
         "id": 12,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 13
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 7
                           }
                        ],
                        "index": 1,
                        "name": "Err"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 13
               },
               {
                  "name": "E",
                  "type": 7
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 13,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 6
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 14
                           }
                        ],
                        "index": 1,
                        "name": "Err"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 6
               },
               {
                  "name": "E",
                  "type": 14
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 14,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "index": 0,
                        "name": "D9orUSDTProvidedLiquidityAtZero"
                     },
                     {
                        "index": 1,
                        "name": "ConversionAmountTooLow"
                     },
                     {
                        "index": 2,
                        "name": "CouldntTransferUSDTFromUser"
                     },
                     {
                        "fields": [
                           {
                              "type": 15,
                              "typeName": "Currency"
                           }
                        ],
                        "index": 3,
                        "name": "InsufficientLiquidity"
                     },
                     {
                        "index": 4,
                        "name": "InsufficientAllowance"
                     },
                     {
                        "fields": [
                           {
                              "type": 15,
                              "typeName": "Currency"
                           }
                        ],
                        "index": 5,
                        "name": "MarketMakerHasInsufficientFunds"
                     },
                     {
                        "index": 6,
                        "name": "InsufficientLiquidityProvided"
                     },
                     {
                        "index": 7,
                        "name": "USDTBalanceInsufficient"
                     },
                     {
                        "index": 8,
                        "name": "LiquidityProviderNotFound"
                     },
                     {
                        "fields": [
                           {
                              "type": 4,
                              "typeName": "Balance"
                           },
                           {
                              "type": 4,
                              "typeName": "Balance"
                           }
                        ],
                        "index": 9,
                        "name": "LiquidityAddedBeyondTolerance"
                     },
                     {
                        "index": 10,
                        "name": "InsufficientLPTokens"
                     },
                     {
                        "index": 11,
                        "name": "InsufficientContractLPTokens"
                     },
                     {
                        "index": 12,
                        "name": "DivisionByZero"
                     },
                     {
                        "index": 13,
                        "name": "MultiplicationError"
                     },
                     {
                        "index": 14,
                        "name": "USDTTooSmall"
                     },
                     {
                        "index": 15,
                        "name": "USDTTooMuch"
                     }
                  ]
               }
            },
            "path": [
               "market_maker",
               "market_maker",
               "Error"
            ]
         }
      },
      {
         "id": 15,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "index": 0,
                        "name": "D9"
                     },
                     {
                        "index": 1,
                        "name": "USDT"
                     }
                  ]
               }
            },
            "path": [
               "market_maker",
               "market_maker",
               "Currency"
            ]
         }
      },
      {
         "id": 16,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 17
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 7
                           }
                        ],
                        "index": 1,
                        "name": "Err"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 17
               },
               {
                  "name": "E",
                  "type": 7
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 17,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 4
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 14
                           }
                        ],
                        "index": 1,
                        "name": "Err"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 4
               },
               {
                  "name": "E",
                  "type": 14
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 18,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 4
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 7
                           }
                        ],
                        "index": 1,
                        "name": "Err"
                     }
                  ]
               }
            },
            "params": [
               {
                  "name": "T",
                  "type": 4
               },
               {
                  "name": "E",
                  "type": 7
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 19,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "type": 15,
                        "typeName": "Currency"
                     },
                     {
                        "type": 15,
                        "typeName": "Currency"
                     }
                  ]
               }
            },
            "path": [
               "market_maker",
               "market_maker",
               "Direction"
            ]
         }
      },
      {
         "id": 20,
         "type": {
            "def": {
               "tuple": [
                  19,
                  19
               ]
            }
         }
      },
      {
         "id": 21,
         "type": {
            "def": {
               "primitive": "u64"
            }
         }
      },
      {
         "id": 22,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "type": 1,
                        "typeName": "[u8; 32]"
                     }
                  ]
               }
            },
            "path": [
               "ink_primitives",
               "types",
               "Hash"
            ]
         }
      },
      {
         "id": 23,
         "type": {
            "def": {
               "variant": {}
            },
            "path": [
               "d9_chain_extension",
               "D9ChainExtension"
            ]
         }
      }
   ],
   "version": "4"
}