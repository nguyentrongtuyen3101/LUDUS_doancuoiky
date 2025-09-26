
class SystemException extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status; 
    this.type = "SYSTEM_ERROR";
  }
}

class ClientException extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status; 
    this.type = "CLIENT_ERROR";
  }
}

class ServerException extends Error {
  constructor(message, status = 409) {
    super(message);
    this.status = status; 
    this.type = "SERVER_ERROR";
  }
}

export { SystemException, ClientException, ServerException };
