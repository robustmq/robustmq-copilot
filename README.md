# RobustMQ Copilot

Web management console for [RobustMQ](https://github.com/robustmq/robustmq) — the next-generation cloud-native and AI-native messaging infrastructure.

Copilot provides a one-stop UI for operating and monitoring RobustMQ clusters: real-time metrics, client/session/topic management, ACL, connectors, schema validation, configuration, and more.

> **Online Demo**: http://demo.robustmq.com:8080

## What is RobustMQ

RobustMQ is a unified messaging engine built with Rust — one binary, one broker, no external dependencies. It natively supports MQTT, Kafka, NATS, AMQP, and **mq9** on a shared storage layer.

| Protocol | Best for                     |
| -------- | ---------------------------- |
| MQTT     | IoT devices, edge sensors    |
| Kafka    | Streaming data pipelines     |
| NATS     | Ultra-low-latency pub/sub    |
| AMQP     | Enterprise messaging         |
| mq9      | AI Agent async communication |

## Quick Start

**Requirements**: Node >= 20, pnpm >= 10

```bash
git clone https://github.com/robustmq/robustmq-copilot.git
cd robustmq-copilot
pnpm install
pnpm ui:dev        # http://localhost:4000
```

By default connects to the RobustMQ admin API at `http://localhost:58080`. Make sure RobustMQ backend is running first — see [RobustMQ Quick Start](https://robustmq.com/QuickGuide/Overview.html).

### Connect to a different backend

Specify only the port — the UI will use the current page's hostname automatically:

```bash
ROBUSTMQ_API_PORT=58080 pnpm ui:dev
```

Or specify a full URL to override both host and port:

```bash
ROBUSTMQ_API_URL=http://192.168.1.100:58080 pnpm ui:dev
```

### Commands

| Command                                  | Description              |
| ---------------------------------------- | ------------------------ |
| `pnpm ui:dev`                            | Dev server on port 4000  |
| `pnpm ui:build`                          | Production build         |
| `pnpm ui:preview`                        | Preview production build |
| `pnpm run dev:8080` / `dev:3001`         | Dev on custom port       |
| `pnpm run preview:8080` / `preview:3001` | Preview on custom port   |

## Features

- **Dashboard** — cluster overview, real-time message in/out rates, connection and session metrics
- **Clients & Sessions** — live connection list, session state, heartbeat info
- **Topics** — topic list, detail view, retain messages, subscription bindings
- **Subscriptions** — all active subscriptions, share group tracking, slow subscribe detection
- **Users & ACL** — user management, access control rules, blacklist
- **Connectors** — create and monitor data connectors (Kafka, HTTP, etc.)
- **Schema** — schema registry and topic binding for message validation
- **Configuration** — full cluster config viewer (runtime, MQTT, storage, limits)
- **System** — alarms, ban log, flapping detection

## Project Structure

```
robustmq-copilot/
├── packages/
│   ├── web-ui/        # React frontend
│   │   ├── src/       # Source code
│   │   └── config/    # Build & API configuration
│   └── services/      # gRPC service definitions
└── package.json
```

## Tech Stack

- **React 19** + TypeScript, TanStack Router, TanStack Query
- **UI**: Radix UI, Tailwind CSS
- **Build**: Rsbuild
- **State**: Zustand

## Troubleshooting

**Port in use** — `pkill -f "rsbuild dev"`

**API errors** — verify RobustMQ backend is running at port 8080, or set `ROBUSTMQ_API_URL`. Check `window.__APP_CONFIG__` in the browser console for the active config.

**Build fails** — `rm -rf packages/web-ui/dist && pnpm ui:build`

## Documentation

- [RobustMQ Official Docs](https://robustmq.com/)
- [RobustMQ GitHub](https://github.com/robustmq/robustmq)
- [mq9 — AI Agent Communication](https://robustmq.com/en/mq9/Overview.html)

## License

[Apache 2.0](LICENSE)
