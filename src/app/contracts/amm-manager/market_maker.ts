export const ammContractABI= {
   "source": {
      "hash": "0x1b765071d2c5ab78710e726a02f2eea104baf3133e79e12e4fd46e9dcc14a22f",
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
                  "label": "fee_numerator",
                  "type": {
                     "displayName": [
                        "u32"
                     ],
                     "type": 4
                  }
               },
               {
                  "label": "fee_denominator",
                  "type": {
                     "displayName": [
                        "u32"
                     ],
                     "type": 4
                  }
               },
               {
                  "label": "liquidity_tolerance_percent",
                  "type": {
                     "displayName": [
                        "u32"
                     ],
                     "type": 4
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
            "type": 3
         },
         "blockNumber": {
            "displayName": [
               "BlockNumber"
            ],
            "type": 4
         },
         "chainExtension": {
            "displayName": [
               "ChainExtension"
            ],
            "type": 25
         },
         "hash": {
            "displayName": [
               "Hash"
            ],
            "type": 24
         },
         "maxEventTopics": 4,
         "timestamp": {
            "displayName": [
               "Timestamp"
            ],
            "type": 23
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
                     "type": 21
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
                     "type": 23
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
                     "type": 3
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
               "type": 13
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
               "type": 13
            },
            "selector": "0xbdd16bfa"
         },
         {
            "args": [
               {
                  "label": "d9_liquidity",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 3
                  }
               },
               {
                  "label": "usdt_liquidity",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 3
                  }
               }
            ],
            "default": false,
            "docs": [
               " ensure added liquidity will not deviate price more than tolerance"
            ],
            "label": "check_new_liquidity",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 13
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
                     "type": 3
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
               "type": 17
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
               "type": 17
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
                     "type": 3
                  }
               },
               {
                  "label": "usdt_liquidity",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 3
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
               "type": 20
            },
            "selector": "0xbdcee4ed"
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
                     "type": 3
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
               "type": 13
            },
            "selector": "0x4a74f8d9"
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
            "label": "get_usdt_balance",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 20
            },
            "selector": "0x1a7158d5"
         },
         {
            "args": [
               {
                  "label": "owner",
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
                     "type": 3
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "check_usdt_allowance",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 13
            },
            "selector": "0x8ab78d6a"
         },
         {
            "args": [
               {
                  "label": "recipient",
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
                     "type": 3
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "send_usdt_to_user",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 13
            },
            "selector": "0x5bd6068b"
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
                        "root": {
                           "layout": {
                              "leaf": {
                                 "key": "0xb0052756",
                                 "ty": 3
                              }
                           },
                           "root_key": "0xb0052756"
                        }
                     },
                     "name": "currency_balances"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 4
                        }
                     },
                     "name": "fee_numerator"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 4
                        }
                     },
                     "name": "fee_denominator"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 3
                        }
                     },
                     "name": "fee_total"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 4
                        }
                     },
                     "name": "liquidity_tolerance_percent"
                  },
                  {
                     "layout": {
                        "root": {
                           "layout": {
                              "struct": {
                                 "fields": [
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x838a4d0c",
                                             "ty": 0
                                          }
                                       },
                                       "name": "account_id"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x838a4d0c",
                                             "ty": 3
                                          }
                                       },
                                       "name": "usdt"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x838a4d0c",
                                             "ty": 3
                                          }
                                       },
                                       "name": "d9"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x838a4d0c",
                                             "ty": 3
                                          }
                                       },
                                       "name": "lp_tokens"
                                    }
                                 ],
                                 "name": "LiquidityProvider"
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
                           "ty": 3
                        }
                     },
                     "name": "lp_tokens"
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
               "primitive": "u128"
            }
         }
      },
      {
         "id": 4,
         "type": {
            "def": {
               "primitive": "u32"
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
                  3,
                  3
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
                              "type": 12
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
                  "type": 12
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
               "composite": {
                  "fields": [
                     {
                        "name": "account_id",
                        "type": 0,
                        "typeName": "AccountId"
                     },
                     {
                        "name": "usdt",
                        "type": 3,
                        "typeName": "Balance"
                     },
                     {
                        "name": "d9",
                        "type": 3,
                        "typeName": "Balance"
                     },
                     {
                        "name": "lp_tokens",
                        "type": 3,
                        "typeName": "Balance"
                     }
                  ]
               }
            },
            "path": [
               "market_maker",
               "market_maker",
               "LiquidityProvider"
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
                              "type": 14
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
                  "type": 14
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
         "id": 14,
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
                              "type": 15
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
                  "type": 15
               }
            ],
            "path": [
               "Result"
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
                        "name": "ConversionAmountTooLow"
                     },
                     {
                        "fields": [
                           {
                              "type": 16,
                              "typeName": "Currency"
                           }
                        ],
                        "index": 1,
                        "name": "InsufficientLiquidity"
                     },
                     {
                        "index": 2,
                        "name": "InsufficientAllowance"
                     },
                     {
                        "fields": [
                           {
                              "type": 16,
                              "typeName": "Currency"
                           }
                        ],
                        "index": 3,
                        "name": "MarketMakerHasInsufficientFunds"
                     },
                     {
                        "index": 4,
                        "name": "InsufficientLiquidityProvided"
                     },
                     {
                        "index": 5,
                        "name": "USDTBalanceInsufficient"
                     },
                     {
                        "index": 6,
                        "name": "LiquidityProviderNotFound"
                     },
                     {
                        "index": 7,
                        "name": "InsufficientLPTokens"
                     },
                     {
                        "index": 8,
                        "name": "InsufficientContractLPTokens"
                     },
                     {
                        "index": 9,
                        "name": "DivisionByZero"
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
         "id": 16,
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
         "id": 17,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 18
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
                  "type": 18
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
         "id": 18,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 19
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 15
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
                  "type": 19
               },
               {
                  "name": "E",
                  "type": 15
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
               "tuple": [
                  16,
                  3
               ]
            }
         }
      },
      {
         "id": 20,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 3
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
                  "type": 3
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
         "id": 21,
         "type": {
            "def": {
               "tuple": [
                  22,
                  22
               ]
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
                        "type": 16,
                        "typeName": "Currency"
                     },
                     {
                        "type": 16,
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
         "id": 23,
         "type": {
            "def": {
               "primitive": "u64"
            }
         }
      },
      {
         "id": 24,
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
         "id": 25,
         "type": {
            "def": {
               "variant": {}
            },
            "path": [
               "ink_env",
               "types",
               "NoChainExtension"
            ]
         }
      }
   ],
   "version": "4"
}