export type GetFeedback = {
    status: "SUCCESS" | "ERROR";
    data?: {
        text: string;
        userId: string;
        selfMonitoringBlock: {
            id: string;
            title: string;
            summary: string;
            icon: string;
            pyschologicalDimensions: {
                name: string;
                acronym: string;
            }[];
        };
    };
    message?: string;
};
