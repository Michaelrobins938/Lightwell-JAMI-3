// src/pages/api/realtime.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false, // stream raw body
  },
};

const proxy = createProxyMiddleware({
  target: "https://api.openai.com",
  changeOrigin: true,
  ws: true, // enable WebSocket proxying
  pathRewrite: {
    "^/api/realtime": "/v1/realtime", // map our local path to OpenAI's
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader("Authorization", `Bearer ${process.env.OPENAI_API_KEY}`);
    proxyReq.setHeader("OpenAI-Beta", "realtime=v1"); // required by OpenAI realtime
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-ignore - Next.js types don't like this, but it works
  proxy(req, res, (err: any) => {
    if (err) {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error");
    }
  });
}
