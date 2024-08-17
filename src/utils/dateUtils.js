export const getTimeElapsed = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    const intervals = [
        { label: 'y', seconds: 31536000 },
        { label: 'm', seconds: 2592000 },
        { label: 'w', seconds: 604800 },
        { label: 'd', seconds: 86400 },
        { label: 'h', seconds: 3600 },
        { label: 'm', seconds: 60 }
    ];

    const interval = intervals.find(i => seconds >= i.seconds);
    if (interval) {
        const count = Math.floor(seconds / interval.seconds);
        return `${count}${interval.label}`;
    }
    return `${seconds}s`; // Seconds are the default case
};
