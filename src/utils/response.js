export function successResponse(res, data = null, message = "Success", status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
    timeStamp: Date.now(),
  });
}
export function errorResponse(res, message = "Error", status = 500, data = null) {
  return res.status(status).json({
    success: false,
    message,
    data,
    timeStamp: Date.now(),
  });
}