class Request {
  async request(options: { api: string; method: string; data: unknown }) {
    const { api, method, data } = options;
    const startTime = Date.now();
    // const uid = session?.user.uid || "";
    let url = `${process.env.GO_API}${api}`;
    let config: RequestInit = {
      method, // 指定请求方法
    };
    if (method === "POST") {
      config = {
        ...config,
        body: JSON.stringify(data),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json", // 指定内容类型
        },
      };
    } else if (method === "GET") {
      url += `?${new URLSearchParams(
        data as Record<string, string>
      ).toString()}`;
    }
    try {
      const res = await fetch(url, config);
      if (!res.ok) {
        return {
          code: 500,
          data: null,
          message: "System error",
        };
      }
      const result: unknown = await res.json();

      // if (!ret) {
      //   // 请求成功
      //   return createResponseJson({ ...result });
      // }
      return {
        code: 0,
        message: "success",
        data: result,
      };
    } catch (e: unknown) {
      return {
        code: 500,
        data: null,
        message: "System error22",
      };
    }
  }

  get(options: { api: string; params: unknown }) {
    return this.request({
      api: options.api,
      method: "GET",
      data: options.params,
    });
  }

  post(options: { api: string; params: unknown }) {
    return this.request({
      api: options.api,
      method: "POST",
      data: options.params,
    });
  }
}

export const serverRequest = new Request();
