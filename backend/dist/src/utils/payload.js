export const payloadSuccess = (res, data) => {
    return res.status(200).json({
        status: "success",
        data,
    });
};
export const payloadError = (res, data) => {
    return res.status(400).json({
        status: "failed",
        data,
    });
};
//# sourceMappingURL=payload.js.map