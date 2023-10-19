class SuccessResponse {
  constructor(status = "success", code = 200, message = "", data = null) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
class ErrorResponse {
    constructor(status = "failed", code = 400, message = "") {
      this.status = status;
      this.code = code;
      this.message = message;
    }
  }

export default { SuccessResponse, ErrorResponse };
