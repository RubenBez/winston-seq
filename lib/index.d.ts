/// <reference types="winston" />
/** Imports */
import { TransportInstance, Transport } from 'winston';
import { ISeqLevels } from './seq-logging';
/** Interfaces */
export declare type IWinstonLogMeta = any;
export declare type IWinstonLogCallback = (err?: any, res?: any) => void;
export interface ISeqOption {
    serverUrl?: string;
    apiKey?: string;
    maxBatchingTime?: number;
    eventSizeLimit?: number;
    batchSizeLimit?: number;
    levelMapper?(level: string): ISeqLevels;
}
export interface ISeqTransportInstance extends TransportInstance {
    new (options?: ISeqOption): ISeqTransportInstance;
}
declare module 'winston' {
    interface Transports {
        Seq: ISeqTransportInstance;
    }
}
export declare class Seq extends Transport implements ISeqTransportInstance {
    readonly name: string;
    serverUrl?: string;
    apiKey?: string;
    maxBatchingTime?: number;
    eventSizeLimit?: number;
    batchSizeLimit?: number;
    levelMapper: (level: string) => ISeqLevels;
    private _seq;
    constructor(options?: ISeqOption);
    log(level: string, msg: string, meta: IWinstonLogMeta, callback: IWinstonLogCallback): void;
    connect(): Promise<void>;
    close(): Promise<boolean>;
    flush(): Promise<boolean>;
    private _isError(obj?);
    private _isPrimitive(obj);
    private _levelMapper(level?);
    private _formatMeta(meta);
    private _getErrorStach(err, id);
    private _formatProperty(prop, errors);
    private _formatError(err, id);
    private _formatDate(date);
    private _formatFunction(fn);
    private _formatArray(arr, errors);
    private _formatBuffer(buffer);
}
