export const merchantContractABI = {
   "source": {
      "hash": "0xf848137a007400f4f0a10d6aa5dff8072a4ca550e8c804b1151170dfa60ee4ab",
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
      "name": "d9-merchant-mining",
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
                  "label": "amm_contract",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               },
               {
                  "label": "mining_pool",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               },
               {
                  "label": "usdt_contract",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               }
            ],
            "default": false,
            "docs": [
               "Constructor that initializes the `bool` value to the given `init_value`."
            ],
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
            "type": 2
         },
         "balance": {
            "displayName": [
               "Balance"
            ],
            "type": 1
         },
         "blockNumber": {
            "displayName": [
               "BlockNumber"
            ],
            "type": 25
         },
         "chainExtension": {
            "displayName": [
               "ChainExtension"
            ],
            "type": 26
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
            "type": 0
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
                     "type": 2
                  }
               },
               {
                  "docs": [],
                  "indexed": true,
                  "label": "expiry",
                  "type": {
                     "displayName": [
                        "Timestamp"
                     ],
                     "type": 0
                  }
               }
            ],
            "docs": [],
            "label": "SubscriptionCreated"
         },
         {
            "args": [
               {
                  "docs": [],
                  "indexed": true,
                  "label": "merchant",
                  "type": {
                     "displayName": [
                        "GreenPointsCreated"
                     ],
                     "type": 23
                  }
               },
               {
                  "docs": [],
                  "indexed": true,
                  "label": "consumer",
                  "type": {
                     "displayName": [
                        "GreenPointsCreated"
                     ],
                     "type": 23
                  }
               }
            ],
            "docs": [],
            "label": "GreenPointsTransaction"
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
            "args": [
               {
                  "label": "usdt_amount",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 1
                  }
               }
            ],
            "default": false,
            "docs": [
               " create merchant account subscription"
            ],
            "label": "subscribe",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 8
            },
            "selector": "0xfb968a8f"
         },
         {
            "args": [],
            "default": false,
            "docs": [
               "withdraw a certain amount of d9 that has been converted into red points"
            ],
            "label": "redeem_d9",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 11
            },
            "selector": "0x47082626"
         },
         {
            "args": [
               {
                  "label": "consumer_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               },
               {
                  "label": "usdt_payment",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 1
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "give_green_points_usdt",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 13
            },
            "selector": "0xf52b0ab9"
         },
         {
            "args": [
               {
                  "label": "consumer_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "give_green_points_d9",
            "mutates": true,
            "payable": true,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 13
            },
            "selector": "0x88b8f067"
         },
         {
            "args": [
               {
                  "label": "merchant_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               },
               {
                  "label": "usdt_amount",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 1
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "pay_merchant_usdt",
            "mutates": true,
            "payable": true,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 13
            },
            "selector": "0xedd032e0"
         },
         {
            "args": [
               {
                  "label": "merchant_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               }
            ],
            "default": false,
            "docs": [
               " a customer pays a merchant using d9"
            ],
            "label": "pay_merchant_d9",
            "mutates": true,
            "payable": true,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 13
            },
            "selector": "0x95d33766"
         },
         {
            "args": [
               {
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "get_expiry",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 8
            },
            "selector": "0xfe38aab5"
         },
         {
            "args": [
               {
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               }
            ],
            "default": false,
            "docs": [
               " get account details"
            ],
            "label": "get_account",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 16
            },
            "selector": "0xd0f48683"
         },
         {
            "args": [
               {
                  "label": "new_amm_contract",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "change_amm_contract",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 21
            },
            "selector": "0x0db11b82"
         },
         {
            "args": [
               {
                  "label": "new_mining_pool",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 2
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "change_mining_pool",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 21
            },
            "selector": "0xafda72a6"
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
                        "root": {
                           "layout": {
                              "leaf": {
                                 "key": "0x368a973a",
                                 "ty": 0
                              }
                           },
                           "root_key": "0x368a973a"
                        }
                     },
                     "name": "merchant_expiry"
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
                                             "key": "0xfe031739",
                                             "ty": 1
                                          }
                                       },
                                       "name": "green_points"
                                    },
                                    {
                                       "layout": {
                                          "struct": {
                                             "fields": [
                                                {
                                                   "layout": {
                                                      "leaf": {
                                                         "key": "0xfe031739",
                                                         "ty": 1
                                                      }
                                                   },
                                                   "name": "0"
                                                },
                                                {
                                                   "layout": {
                                                      "leaf": {
                                                         "key": "0xfe031739",
                                                         "ty": 1
                                                      }
                                                   },
                                                   "name": "1"
                                                }
                                             ],
                                             "name": "(A, B)"
                                          }
                                       },
                                       "name": "relationship_factors"
                                    },
                                    {
                                       "layout": {
                                          "enum": {
                                             "dispatchKey": "0xfe031739",
                                             "name": "Option",
                                             "variants": {
                                                "0": {
                                                   "fields": [],
                                                   "name": "None"
                                                },
                                                "1": {
                                                   "fields": [
                                                      {
                                                         "layout": {
                                                            "leaf": {
                                                               "key": "0xfe031739",
                                                               "ty": 0
                                                            }
                                                         },
                                                         "name": "0"
                                                      }
                                                   ],
                                                   "name": "Some"
                                                }
                                             }
                                          }
                                       },
                                       "name": "last_conversion"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0xfe031739",
                                             "ty": 1
                                          }
                                       },
                                       "name": "redeemed_usdt"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0xfe031739",
                                             "ty": 1
                                          }
                                       },
                                       "name": "redeemed_d9"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0xfe031739",
                                             "ty": 0
                                          }
                                       },
                                       "name": "created_at"
                                    }
                                 ],
                                 "name": "Account"
                              }
                           },
                           "root_key": "0xfe031739"
                        }
                     },
                     "name": "accounts"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 1
                        }
                     },
                     "name": "subscription_fee"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 2
                        }
                     },
                     "name": "usdt_contract"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 2
                        }
                     },
                     "name": "amm_contract"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 2
                        }
                     },
                     "name": "mining_pool"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 0
                        }
                     },
                     "name": "milliseconds_day"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 2
                        }
                     },
                     "name": "admin"
                  }
               ],
               "name": "D9MerchantMining"
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
               "primitive": "u64"
            }
         }
      },
      {
         "id": 1,
         "type": {
            "def": {
               "primitive": "u128"
            }
         }
      },
      {
         "id": 2,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "type": 3,
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
         "id": 3,
         "type": {
            "def": {
               "array": {
                  "len": 32,
                  "type": 4
               }
            }
         }
      },
      {
         "id": 4,
         "type": {
            "def": {
               "primitive": "u8"
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
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 0
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 10
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
                  "type": 0
               },
               {
                  "name": "E",
                  "type": 10
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 10,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "index": 0,
                        "name": "InsufficientPayment"
                     },
                     {
                        "index": 1,
                        "name": "InsufficientAllowance"
                     },
                     {
                        "index": 2,
                        "name": "NoMerchantAccountFound"
                     },
                     {
                        "index": 3,
                        "name": "MerchantAccountExpired"
                     },
                     {
                        "index": 4,
                        "name": "NoAccountFound"
                     },
                     {
                        "index": 5,
                        "name": "NothingToRedeem"
                     },
                     {
                        "index": 6,
                        "name": "TransferringToMainContract"
                     },
                     {
                        "index": 7,
                        "name": "TransferringToUSDTToMerchant"
                     },
                     {
                        "index": 8,
                        "name": "UserUSDTBalanceInsufficient"
                     },
                     {
                        "index": 9,
                        "name": "D9TransferFailed"
                     },
                     {
                        "index": 10,
                        "name": "USDTTransferFailed"
                     },
                     {
                        "index": 11,
                        "name": "OnlyAdmin"
                     },
                     {
                        "index": 12,
                        "name": "GrantingAllowanceFailed"
                     },
                     {
                        "index": 13,
                        "name": "AMMConversionFailed"
                     },
                     {
                        "index": 14,
                        "name": "ReceivingUSDTFromUser"
                     },
                     {
                        "index": 15,
                        "name": "ConvertingToD9"
                     },
                     {
                        "index": 16,
                        "name": "SendUSDTToMerchant"
                     },
                     {
                        "index": 17,
                        "name": "SendingD9ToMiningPool"
                     },
                     {
                        "index": 18,
                        "name": "SendingUSDTToAMM"
                     },
                     {
                        "index": 19,
                        "name": "GettingUSDTFromAMM"
                     },
                     {
                        "index": 20,
                        "name": "RedeemD9TransferFailed"
                     }
                  ]
               }
            },
            "path": [
               "d9_merchant_mining",
               "d9_merchant_mining",
               "Error"
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
                        "fields": [
                           {
                              "type": 12
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
                  "type": 12
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
         "id": 12,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 1
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 10
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
                  "type": 1
               },
               {
                  "name": "E",
                  "type": 10
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
                              "type": 15
                           }
                        ],
                        "index": 0,
                        "name": "Ok"
                     },
                     {
                        "fields": [
                           {
                              "type": 10
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
                  "type": 15
               },
               {
                  "name": "E",
                  "type": 10
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
               "composite": {
                  "fields": [
                     {
                        "name": "merchant",
                        "type": 1,
                        "typeName": "Balance"
                     },
                     {
                        "name": "consumer",
                        "type": 1,
                        "typeName": "Balance"
                     }
                  ]
               }
            },
            "path": [
               "d9_merchant_mining",
               "d9_merchant_mining",
               "GreenPointsResult"
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
                        "index": 0,
                        "name": "None"
                     },
                     {
                        "fields": [
                           {
                              "type": 18
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
                  "type": 18
               }
            ],
            "path": [
               "Option"
            ]
         }
      },
      {
         "id": 18,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "name": "green_points",
                        "type": 1,
                        "typeName": "Balance"
                     },
                     {
                        "name": "relationship_factors",
                        "type": 19,
                        "typeName": "(Balance, Balance)"
                     },
                     {
                        "name": "last_conversion",
                        "type": 20,
                        "typeName": "Option<Timestamp>"
                     },
                     {
                        "name": "redeemed_usdt",
                        "type": 1,
                        "typeName": "Balance"
                     },
                     {
                        "name": "redeemed_d9",
                        "type": 1,
                        "typeName": "Balance"
                     },
                     {
                        "name": "created_at",
                        "type": 0,
                        "typeName": "Timestamp"
                     }
                  ]
               }
            },
            "path": [
               "d9_merchant_mining",
               "d9_merchant_mining",
               "Account"
            ]
         }
      },
      {
         "id": 19,
         "type": {
            "def": {
               "tuple": [
                  1,
                  1
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
                        "index": 0,
                        "name": "None"
                     },
                     {
                        "fields": [
                           {
                              "type": 0
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
                  "type": 0
               }
            ],
            "path": [
               "Option"
            ]
         }
      },
      {
         "id": 21,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 22
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
                  "type": 22
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
         "id": 22,
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
                              "type": 10
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
                  "type": 10
               }
            ],
            "path": [
               "Result"
            ]
         }
      },
      {
         "id": 23,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "name": "account_id",
                        "type": 2,
                        "typeName": "AccountId"
                     },
                     {
                        "name": "green_points",
                        "type": 1,
                        "typeName": "Balance"
                     }
                  ]
               }
            },
            "path": [
               "d9_merchant_mining",
               "d9_merchant_mining",
               "GreenPointsCreated"
            ]
         }
      },
      {
         "id": 24,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "type": 3,
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
               "primitive": "u32"
            }
         }
      },
      {
         "id": 26,
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