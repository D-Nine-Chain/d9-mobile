"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendCode = exports.Code = exports.CodeSubmittableResult = void 0;
const api_1 = require("@polkadot/api");
const util_1 = require("@polkadot/util");
const util_js_1 = require("../util.js");
const Base_js_1 = require("./Base.js");
const Blueprint_js_1 = require("./Blueprint.js");
const Contract_js_1 = require("./Contract.js");
const util_js_2 = require("./util.js");
class CodeSubmittableResult extends api_1.SubmittableResult {
    constructor(result, blueprint, contract) {
        super(result);
        this.blueprint = blueprint;
        this.contract = contract;
    }
}
exports.CodeSubmittableResult = CodeSubmittableResult;
function isValidCode(code) {
    return (0, util_1.isWasm)(code) || (0, util_1.isRiscV)(code);
}
class Code extends Base_js_1.Base {
    constructor(api, abi, wasm, decorateMethod) {
        super(api, abi, decorateMethod);
        this.__internal__tx = {};
        this.__internal__instantiate = (constructorOrId, { gasLimit = util_1.BN_ZERO, salt, storageDepositLimit = null, value = util_1.BN_ZERO }, params) => {
            return this.api.tx.contracts.instantiateWithCode(value, 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore jiggle v1 weights, metadata points to latest
            this._isWeightV1
                ? (0, util_js_2.convertWeight)(gasLimit).v1Weight
                : (0, util_js_2.convertWeight)(gasLimit).v2Weight, storageDepositLimit, (0, util_1.compactAddLength)(this.code), this.abi.findConstructor(constructorOrId).toU8a(params), (0, util_js_2.encodeSalt)(salt)).withResultTransform((result) => new CodeSubmittableResult(result, ...((0, util_js_1.applyOnEvent)(result, ['CodeStored', 'Instantiated'], (records) => records.reduce(([blueprint, contract], { event }) => this.api.events.contracts.Instantiated.is(event)
                ? [blueprint, new Contract_js_1.Contract(this.api, this.abi, event.data[1], this._decorateMethod)]
                : this.api.events.contracts.CodeStored.is(event)
                    ? [new Blueprint_js_1.Blueprint(this.api, this.abi, event.data[0], this._decorateMethod), contract]
                    : [blueprint, contract], [undefined, undefined])) || [undefined, undefined])));
        };
        this.code = isValidCode(this.abi.info.source.wasm)
            ? this.abi.info.source.wasm
            : (0, util_1.u8aToU8a)(wasm);
        if (!isValidCode(this.code)) {
            throw new Error('Invalid code provided');
        }
        this.abi.constructors.forEach((c) => {
            if ((0, util_1.isUndefined)(this.__internal__tx[c.method])) {
                this.__internal__tx[c.method] = (0, util_js_2.createBluePrintTx)(c, (o, p) => this.__internal__instantiate(c, o, p));
            }
        });
    }
    get tx() {
        return this.__internal__tx;
    }
}
exports.Code = Code;
function extendCode(type, decorateMethod) {
    var _a;
    return _a = class extends Code {
            constructor(api, abi, wasm) {
                super(api, abi, wasm, decorateMethod);
            }
        },
        _a.__CodeType = type,
        _a;
}
exports.extendCode = extendCode;
