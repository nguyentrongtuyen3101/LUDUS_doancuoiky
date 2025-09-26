export function successResponse(res, data = null, message = "Success", status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
    timeStamp: Date.now(),
  });
}
