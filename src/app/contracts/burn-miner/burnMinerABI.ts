export const burnMinerABI = {
   "source": {
      "hash": "0x1e8214fcbc1557ba5a3fe04225703542fa4b9392af39eaf4660f7d0be635f7cb",
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
      "name": "d9-burn-mining",
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
                  "label": "burn_manager_contract",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 1
                  }
               },
               {
                  "label": "burn_minimum",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 0
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "new",
            "payable": true,
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
            "type": 1
         },
         "balance": {
            "displayName": [
               "Balance"
            ],
            "type": 0
         },
         "blockNumber": {
            "displayName": [
               "BlockNumber"
            ],
            "type": 23
         },
         "chainExtension": {
            "displayName": [
               "ChainExtension"
            ],
            "type": 24
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
            "type": 4
         }
      },
      "events": [],
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
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 1
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "get_account",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 8
            },
            "selector": "0xd0f48683"
         },
         {
            "args": [
               {
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 1
                  }
               },
               {
                  "label": "burn_amount",
                  "type": {
                     "displayName": [
                        "Balance"
                     ],
                     "type": 0
                  }
               }
            ],
            "default": false,
            "docs": [
               " burn funcion callable by ownly master contract",
               "",
               " does the necessary checks then calls the internal burn function `_burn`"
            ],
            "label": "initiate_burn",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 13
            },
            "selector": "0x34aff0a0"
         },
         {
            "args": [
               {
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 1
                  }
               }
            ],
            "default": false,
            "docs": [
               " calculate values to be used by the burn manager"
            ],
            "label": "prepare_withdrawal",
            "mutates": true,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 16
            },
            "selector": "0x9c2e384b"
         },
         {
            "args": [
               {
                  "label": "account_id",
                  "type": {
                     "displayName": [
                        "AccountId"
                     ],
                     "type": 1
                  }
               }
            ],
            "default": false,
            "docs": [],
            "label": "get_ancestors",
            "mutates": false,
            "payable": false,
            "returnType": {
               "displayName": [
                  "ink",
                  "MessageResult"
               ],
               "type": 19
            },
            "selector": "0xe2ee2364"
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
                     "name": "total_amount_burned"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 1
                        }
                     },
                     "name": "burn_manager_contract"
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
                                             "key": "0x125717b1",
                                             "ty": 4
                                          }
                                       },
                                       "name": "creation_timestamp"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x125717b1",
                                             "ty": 0
                                          }
                                       },
                                       "name": "amount_burned"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x125717b1",
                                             "ty": 0
                                          }
                                       },
                                       "name": "balance_due"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x125717b1",
                                             "ty": 0
                                          }
                                       },
                                       "name": "balance_paid"
                                    },
                                    {
                                       "layout": {
                                          "enum": {
                                             "dispatchKey": "0x125717b1",
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
                                                               "key": "0x125717b1",
                                                               "ty": 4
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
                                       "name": "last_withdrawal"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x125717b1",
                                             "ty": 4
                                          }
                                       },
                                       "name": "last_burn"
                                    },
                                    {
                                       "layout": {
                                          "struct": {
                                             "fields": [
                                                {
                                                   "layout": {
                                                      "leaf": {
                                                         "key": "0x125717b1",
                                                         "ty": 0
                                                      }
                                                   },
                                                   "name": "0"
                                                },
                                                {
                                                   "layout": {
                                                      "leaf": {
                                                         "key": "0x125717b1",
                                                         "ty": 0
                                                      }
                                                   },
                                                   "name": "1"
                                                }
                                             ],
                                             "name": "(A, B)"
                                          }
                                       },
                                       "name": "referral_boost_coefficients"
                                    },
                                    {
                                       "layout": {
                                          "leaf": {
                                             "key": "0x125717b1",
                                             "ty": 4
                                          }
                                       },
                                       "name": "last_interaction"
                                    }
                                 ],
                                 "name": "Account"
                              }
                           },
                           "root_key": "0x125717b1"
                        }
                     },
                     "name": "accounts"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 0
                        }
                     },
                     "name": "burn_minimum"
                  },
                  {
                     "layout": {
                        "leaf": {
                           "key": "0x00000000",
                           "ty": 4
                        }
                     },
                     "name": "day_milliseconds"
                  }
               ],
               "name": "D9burnMining"
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
               "primitive": "u128"
            }
         }
      },
      {
         "id": 1,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "type": 2,
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
         "id": 2,
         "type": {
            "def": {
               "array": {
                  "len": 32,
                  "type": 3
               }
            }
         }
      },
      {
         "id": 3,
         "type": {
            "def": {
               "primitive": "u8"
            }
         }
      },
      {
         "id": 4,
         "type": {
            "def": {
               "primitive": "u64"
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
                        "index": 0,
                        "name": "None"
                     },
                     {
                        "fields": [
                           {
                              "type": 10
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
                  "type": 10
               }
            ],
            "path": [
               "Option"
            ]
         }
      },
      {
         "id": 10,
         "type": {
            "def": {
               "composite": {
                  "fields": [
                     {
                        "name": "creation_timestamp",
                        "type": 4,
                        "typeName": "Timestamp"
                     },
                     {
                        "name": "amount_burned",
                        "type": 0,
                        "typeName": "Balance"
                     },
                     {
                        "name": "balance_due",
                        "type": 0,
                        "typeName": "Balance"
                     },
                     {
                        "name": "balance_paid",
                        "type": 0,
                        "typeName": "Balance"
                     },
                     {
                        "name": "last_withdrawal",
                        "type": 11,
                        "typeName": "Option<Timestamp>"
                     },
                     {
                        "name": "last_burn",
                        "type": 4,
                        "typeName": "Timestamp"
                     },
                     {
                        "name": "referral_boost_coefficients",
                        "type": 12,
                        "typeName": "(Balance, Balance)"
                     },
                     {
                        "name": "last_interaction",
                        "type": 4,
                        "typeName": "Timestamp"
                     }
                  ]
               }
            },
            "path": [
               "d9_burn_common",
               "Account"
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
               "tuple": [
                  0,
                  0
               ]
            }
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
                              "type": 0
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
                  "type": 0
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
                        "name": "BurnAmountInsufficient"
                     },
                     {
                        "index": 1,
                        "name": "NoAccountFound"
                     },
                     {
                        "index": 2,
                        "name": "EarlyWithdrawalAttempt"
                     },
                     {
                        "index": 3,
                        "name": "ContractBalanceTooLow"
                     },
                     {
                        "index": 4,
                        "name": "RestrictedFunction"
                     },
                     {
                        "index": 5,
                        "name": "UsePortfolioExecuteFunction"
                     },
                     {
                        "index": 6,
                        "name": "WithdrawalExceedsBalance"
                     },
                     {
                        "index": 7,
                        "name": "TransferFailed"
                     },
                     {
                        "index": 8,
                        "name": "InvalidCaller"
                     },
                     {
                        "index": 9,
                        "name": "InvalidBurnContract"
                     },
                     {
                        "index": 10,
                        "name": "BurnContractAlreadyAdded"
                     },
                     {
                        "index": 11,
                        "name": "CrossContractCallFailed"
                     },
                     {
                        "index": 12,
                        "name": "WithdrawalNotAllowed"
                     },
                     {
                        "index": 13,
                        "name": "RuntimeErrorGettingAncestors"
                     },
                     {
                        "index": 14,
                        "name": "NoAncestorsFound"
                     }
                  ]
               }
            },
            "path": [
               "d9_burn_common",
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
                              "type": 18
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
                  "type": 18
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
         "id": 18,
         "type": {
            "def": {
               "tuple": [
                  0,
                  4
               ]
            }
         }
      },
      {
         "id": 19,
         "type": {
            "def": {
               "variant": {
                  "variants": [
                     {
                        "fields": [
                           {
                              "type": 20
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
                  "type": 20
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
                              "type": 21
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
                  "type": 21
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
               "sequence": {
                  "type": 1
               }
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
                        "type": 2,
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
               "primitive": "u32"
            }
         }
      },
      {
         "id": 24,
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