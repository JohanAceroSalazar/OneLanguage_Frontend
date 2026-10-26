export function firstName(user) {
    const value = user?.fullName || user?.name || user?.firstName || "";
    return value.trim().split(/\s+/)[0] || "";
}
