declare module 'google-trends-api' {
    interface InterestOverTimeOptions {
        keyword: string | string[];
        startTime?: Date;
        endTime?: Date;
        geo?: string;
        hl?: string;
        timezone?: string | number;
        granularTimeResolution?: boolean;
    }

    export function interestOverTime(options: InterestOverTimeOptions): Promise<string>;
    // Add other exported functions as needed

}