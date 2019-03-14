'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/** Imports */
var winston_1 = require("winston");
var seq_logging_1 = require("./seq-logging");
var Seq = (function (_super) {
    __extends(Seq, _super);
    function Seq(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.name = 'seq';
        _this.serverUrl = options.serverUrl;
        _this.apiKey = options.apiKey;
        _this.maxBatchingTime = options.maxBatchingTime;
        _this.eventSizeLimit = options.eventSizeLimit;
        _this.batchSizeLimit = options.batchSizeLimit;
        _this.levelMapper = options.levelMapper !== undefined
            ? options.levelMapper
            : _this._levelMapper;
        _this.connect();
        return _this;
    }
    Seq.prototype.log = function (level, msg, meta, callback) {
        var _this = this;
        var seqLog = {
            level: this.levelMapper(level),
            messageTemplate: msg
        };
        var _a = this._formatMeta(meta), properties = _a.properties, errors = _a.errors;
        if (errors.length !== 0) {
            seqLog.exception = errors
                .map(function (_a) {
                var error = _a.error, id = _a.id;
                return _this._getErrorStach(error, id);
            })
                .join('\n\n');
        }
        if (properties !== null) {
            seqLog.properties = properties;
        }
        this._seq.emit(seqLog);
        this.emit('logged');
        callback(null, true);
    };
    Seq.prototype.connect = function () {
        var _this = this;
        this._seq = new seq_logging_1.default({
            serverUrl: this.serverUrl,
            apiKey: this.apiKey,
            maxBatchingTime: this.maxBatchingTime,
            eventSizeLimit: this.eventSizeLimit,
            batchSizeLimit: this.batchSizeLimit,
            onError: function (err) { return _this.emit('error', err); }
        });
        return Promise.resolve();
    };
    Seq.prototype.close = function () {
        return this._seq.close();
    };
    Seq.prototype.flush = function () {
        return this._seq.flush();
    };
    Seq.prototype._isError = function (obj) {
        if (!obj) {
            return false;
        }
        if (obj instanceof Error) {
            return true;
        }
        if (obj.constructor.name === 'Error') {
            return true;
        }
        // quack-quack
        if (typeof obj.name === 'string'
            && typeof obj.message === 'string'
            && typeof obj.stack === 'string') {
            return true;
        }
        return false;
    };
    Seq.prototype._isPrimitive = function (obj) {
        if (obj === null || obj === undefined) {
            return true;
        }
        var typeOfObj = typeof obj;
        return typeOfObj === 'string'
            || typeOfObj === 'number'
            || typeOfObj === 'boolean';
    };
    Seq.prototype._levelMapper = function (level) {
        if (level === void 0) { level = ''; }
        switch (level.toLowerCase()) {
            case 'error': return 'Error';
            case 'warn': return 'Warning';
            case 'info': return 'Information';
            case 'debug': return 'Debug';
            case 'verbose': return 'Verbose';
            case 'silly': return 'Verbose';
            /** Non standart */
            case 'fatal': return 'Fatal';
            default: return 'Information';
        }
    };
    Seq.prototype._formatMeta = function (meta) {
        /** Flat error list */
        var errors = [];
        return {
            properties: this._formatProperty(meta, errors),
            errors: errors
        };
    };
    Seq.prototype._getErrorStach = function (err, id) {
        var stack = err.stack !== undefined
            ? err.stack
            : err.toString();
        return "@" + id + ": " + stack;
    };
    Seq.prototype._formatProperty = function (prop, errors) {
        if (this._isError(prop)) {
            var id = errors.length;
            errors.push({ error: prop, id: id });
            return { error: this._formatError(prop, id) };
        }
        if (prop instanceof Date) {
            return { timestamp: this._formatDate(prop) };
        }
        if (typeof prop === 'function') {
            return { function: this._formatFunction(prop) };
        }
        if (prop instanceof Buffer) {
            return { buffer: this._formatBuffer(prop) };
        }
        if (Array.isArray(prop)) {
            return { array: this._formatArray(prop, errors) };
        }
        if (this._isPrimitive(prop)) {
            return prop;
        }
        if (typeof prop !== 'object') {
            if (typeof prop.toString === 'function') {
                return prop.toString();
            }
            return null;
        }
        var properties = {};
        for (var key in prop) {
            var value = prop[key];
            properties[key] = this._formatProperty(value, errors);
        }
        return properties;
    };
    Seq.prototype._formatError = function (err, id) {
        var result = Object.getOwnPropertyNames(err)
            .filter(function (key) { return key !== 'stack'; })
            .reduce(function (res, key) {
            res[key] = err[key];
            return res;
        }, {});
        result.stack = "@" + id;
        return result;
    };
    Seq.prototype._formatDate = function (date) {
        return date.getTime();
    };
    Seq.prototype._formatFunction = function (fn) {
        return fn.toString();
    };
    Seq.prototype._formatArray = function (arr, errors) {
        var _this = this;
        return arr.map(function (val) { return _this._formatProperty(val, errors); });
    };
    Seq.prototype._formatBuffer = function (buffer) {
        return buffer.slice(0);
    };
    return Seq;
}(winston_1.Transport));
exports.Seq = Seq;
/**
 * Define a getter so that `winston.transports.Seq`
 * is available and thus backwards compatible.
 */
winston_1.transports.Seq = Seq; /** @todo */
//# sourceMappingURL=index.js.map