import { get as configGet, getDataService } from '../../config';
import { request } from '../../utils/request';
import { parseTx } from './parse';
import {
    T_API_TX,
    T_TX,
    ITransfer,
    txApi,
    IIssue,
    IReissue,
    IBurn,
    IExchange,
    ILease,
    ICancelLeasing, ICreateAlias, IMassTransfer
} from './interface';
import { contains } from 'ts-utils';
import { TRANSACTION_TYPE_NUMBER } from '@waves/waves-signature-generator';
import { TransactionFilters } from '@waves/data-service-client-js/src/types';


export function list(address: string, limit = 100): Promise<Array<T_TX>> {
    return request({ url: `${configGet('node')}/transactions/address/${address}/limit/${limit}` })
        .then(([transactions]) => parseTx(transactions, false));
}

export function getExchangeTxList(options: TransactionFilters = Object.create(null)): Promise<Array<IExchange>> {
    return request({ method: () => getDataService().getExchangeTxs(options).then(r => r.data) })
        .then((transactions: any) => parseTx(transactions, false, true) as any);
}

export function listUTX(address?: string): Promise<Array<T_TX>> {
    return request<Array<T_API_TX>>({ url: `${configGet('node')}/transactions/unconfirmed` })
        .then((transactions) => filterByAddress(transactions, address))
        .then((transactions) => parseTx(transactions, true));
}

export function get(id: string): Promise<T_TX> {
    return request<T_API_TX>({ url: `${configGet('node')}/transactions/info/${id}` })
        .then((tx) => parseTx([tx], false))
        .then((list: Array<T_TX>) => list[0]);
}

export function getUTX(id: string): Promise<T_TX> {
    return request<T_API_TX>({ url: `${configGet('node')}/transactions/unconfirmed/info/${id}` })
        .then((tx) => parseTx([tx], true))
        .then((list: Array<T_TX>) => list[0]);
}

export function filterByAddress(transactions: Array<T_API_TX>, address?: string): Array<T_API_TX> {
    if (address) {
        return transactions.filter(contains({ sender: address }));
    }
    return transactions;
}

export function isTransfer(tx: T_TX): tx is ITransfer;
export function isTransfer(tx: T_API_TX): tx is txApi.ITransfer;
export function isTransfer(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.MASS_TRANSFER;
}

export function isIssue(tx: T_TX): tx is IIssue;
export function isIssue(tx: T_API_TX): tx is txApi.IIssue;
export function isIssue(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.ISSUE;
}

export function isReissue(tx: T_TX): tx is IReissue;
export function isReissue(tx: T_API_TX): tx is txApi.IReissue;
export function isReissue(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.REISSUE;
}

export function isBurn(tx: T_TX): tx is IBurn;
export function isBurn(tx: T_API_TX): tx is txApi.IBurn;
export function isBurn(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.BURN;
}

export function isExchange(tx: T_TX): tx is IExchange;
export function isExchange(tx: T_API_TX): tx is txApi.IExchange;
export function isExchange(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.EXCHANGE;
}

export function isLeasing(tx: T_TX): tx is ILease;
export function isLeasing(tx: T_API_TX): tx is txApi.ILease;
export function isLeasing(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.LEASE;
}

export function isCancelLeasing(tx: T_TX): tx is ICancelLeasing;
export function isCancelLeasing(tx: T_API_TX): tx is txApi.ICancelLeasing;
export function isCancelLeasing(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.CANCEL_LEASING;
}

export function isCreateAlias(tx: T_TX): tx is ICreateAlias;
export function isCreateAlias(tx: T_API_TX): tx is txApi.ICreateAlias;
export function isCreateAlias(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.CREATE_ALIAS;
}

export function isMassTransfer(tx: T_TX): tx is IMassTransfer;
export function isMassTransfer(tx: T_API_TX): tx is txApi.IMassTransfer;
export function isMassTransfer(tx: T_TX | T_API_TX): boolean {
    return tx.type === TRANSACTION_TYPE_NUMBER.MASS_TRANSFER;
}

