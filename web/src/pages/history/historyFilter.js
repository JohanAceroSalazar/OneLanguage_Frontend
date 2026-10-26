export const RECENT_DAYS = 7;

export function filterTranslations(translations, filter, now = Date.now()) {
    const cutoff = now - RECENT_DAYS * 24 * 60 * 60 * 1000;

    return translations
        .filter((translation) => {
            if (filter === "all") return true;
            const timestamp = Date.parse(translation.createdAt);
            if (Number.isNaN(timestamp)) return false;
            return filter === "recent" ? timestamp >= cutoff && timestamp <= now : timestamp < cutoff;
        })
        .sort((first, second) => {
            const firstTime = Date.parse(first.createdAt);
            const secondTime = Date.parse(second.createdAt);
            return (Number.isNaN(secondTime) ? -Infinity : secondTime) - (Number.isNaN(firstTime) ? -Infinity : firstTime);
        });
}
