declare module "sockjs-client" {
  class SockJS {
    constructor(url: string, _deprecated?: any, options?: any);
    onopen: () => void;
    onmessage: (e: any) => void;
    onclose: () => void;
    send(data: string): void;
    close(): void;
  }
  export = SockJS;
}
