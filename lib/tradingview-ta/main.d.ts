import { EXCHANGES_ENUM, SCREENERS_ENUM, INTERVALS_ENUM } from './contracts';
import Axios from 'axios';
export declare class TradingViewScan {
    screener: SCREENERS_ENUM;
    exchange: EXCHANGES_ENUM;
    symbol: string;
    interval: INTERVALS_ENUM;
    private axiosInstance;
    constructor(screener: SCREENERS_ENUM, exchange: EXCHANGES_ENUM, symbol: string, interval: INTERVALS_ENUM, axiosInstance?: typeof Axios);
    analyze(): Promise<{
        oscillators: {};
        moving_averages: {};
        summary: {};
        indicators: {};
    } | {
        oscillators: {};
        moving_averages: {};
        summary: {};
        indicators: {};
        screener: SCREENERS_ENUM;
        exchange: EXCHANGES_ENUM;
        symbol: string;
        interval: INTERVALS_ENUM;
        time: string;
    }>;
    _makeRequest(): Promise<{
        oscillators: {};
        moving_averages: {};
        summary: {};
        indicators: {};
    } | {
        oscillators: {};
        moving_averages: {};
        summary: {};
        indicators: {};
        screener: SCREENERS_ENUM;
        exchange: EXCHANGES_ENUM;
        symbol: string;
        interval: INTERVALS_ENUM;
        time: string;
    }>;
    validateExchange(): Promise<void>;
    validateScreener(): Promise<void>;
    validateSymbol(): Promise<void>;
}
