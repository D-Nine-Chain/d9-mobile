"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendContract = exports.Contract = exports.ContractSubmittableResult = void 0;
const rxjs_1 = require("rxjs");
const api_1 = require("@polkadot/api");
const util_1 = require("@polkadot/util");
const util_js_1 = require("../util.js");
const Base_js_1 = require("./Base.js");
const util_js_2 = require("./util.js");
const MAX_CALL_GAS = new util_1.BN(5000000000000).isub(util_1.BN_ONE);
const l = (0, util_1.logger)('Contract');
function createQuery(meta, fn) {
    return (0, util_js_2.withMeta)(meta, (origin, options, ...params) => fn(origin, options, params));
}
function createTx(meta, fn) {
    return (0, util_js_2.withMeta)(meta, (options, ...params) => fn(options, params));
}
class ContractSubmittableResult extends api_1.SubmittableResult {
    constructor(result, contractEvents) {
        super(result);
        this.contractEvents = contractEvents;
    }
}
exports.ContractSubmittableResult = ContractSubmittableResult;
class Contract extends Base_js_1.Base {
    constructor(api, abi, address, decorateMethod) {
        super(api, abi, decorateMethod);
        this.__internal__query = {};
        this.__internal__tx = {};
        this.__internal__getGas = (_gasLimit, isCall = false) => {
            const weight = (0, util_js_2.convertWeight)(_gasLimit);
            if (weight.v1Weight.gt(util_1.BN_ZERO)) {
                return weight;
            }
            return (0, util_js_2.convertWeight)(isCall
                ? MAX_CALL_GAS
                : (0, util_js_2.convertWeight)(this.api.consts.system.blockWeights
                    ? this.api.consts.system.blockWeights.maxBlock
                    : this.api.consts.system['maximumBlockWeight']).v1Weight.muln(64).div(util_1.BN_HUNDRED));
        };
        this.__internal__exec = (messageOrId, { gasLimit = util_1.BN_ZERO, storageDepositLimit = null, value = util_1.BN_ZERO }, params) => {
            return this.api.tx.contracts.call(this.address, value, 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore jiggle v1 weights, metadata points to latest
            this._isWeightV1
                ? (0, util_js_2.convertWeight)(gasLimit).v1Weight
                : (0, util_js_2.convertWeight)(gasLimit).v2Weight, storageDepositLimit, this.abi.findMessage(messageOrId).toU8a(params)).withResultTransform((result) => 
            // ContractEmitted is the current generation, ContractExecution is the previous generation
            new ContractSubmittableResult(result, (0, util_js_1.applyOnEvent)(result, ['ContractEmitted', 'ContractExecution'], (records) => records
                .map(({ event: { data: [, data] } }) => {
                try {
                    return this.abi.decodeEvent(data);
                }
                catch (error) {
                    l.error(`Unable to decode contract event: ${error.message}`);
                    return null;
                }
            })
                .filter((decoded) => !!decoded))));
        };
        this.__internal__read = (messageOrId, { gasLimit = util_1.BN_ZERO, storageDepositLimit = null, value = util_1.BN_ZERO }, params) => {
            const message = this.abi.findMessage(messageOrId);
            return {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                send: this._decorateMethod((origin) => this.api.rx.call.contractsApi.call(origin, this.address, value, 
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore jiggle v1 weights, metadata points to latest
                this._isWeightV1
                    ? this.__internal__getGas(gasLimit, true).v1Weight
                    : this.__internal__getGas(gasLimit, true).v2Weight, storageDepositLimit, message.toU8a(params)).pipe((0, rxjs_1.map)(({ debugMessage, gasConsumed, gasRequired, result, storageDeposit }) => ({
                    debugMessage,
                    gasConsumed,
                    gasRequired: gasRequired && !(0, util_js_2.convertWeight)(gasRequired).v1Weight.isZero()
                        ? gasRequired
                        : gasConsumed,
                    output: result.isOk && message.returnType
                        ? this.abi.registry.createTypeUnsafe(message.returnType.lookupName || message.returnType.type, [result.asOk.data.toU8a(true)], { isPedantic: true })
                        : null,
                    result,
                    storageDeposit
                }))))
            };
        };
        this.address = this.registry.createType('AccountId', address);
        this.abi.messages.forEach((m) => {
            if ((0, util_1.isUndefined)(this.__internal__tx[m.method])) {
                this.__internal__tx[m.method] = createTx(m, (o, p) => this.__internal__exec(m, o, p));
            }
            if ((0, util_1.isUndefined)(this.__internal__query[m.method])) {
                this.__internal__query[m.method] = createQuery(m, (f, o, p) => this.__internal__read(m, o, p).send(f));
            }
        });
    }
    get query() {
        return this.__internal__query;
    }
    get tx() {
        return this.__internal__tx;
    }
}
exports.Contract = Contract;
function extendContract(type, decorateMethod) {
    var _a;
    return _a = class extends Contract {
            constructor(api, abi, address) {
                super(api, abi, address, decorateMethod);
            }
        },
        _a.__ContractType = type,
        _a;
}
exports.extendContract = extendContract;
