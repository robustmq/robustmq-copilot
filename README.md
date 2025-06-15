# RobustMQ-Copilot

The one-step RobustMQ operation and maintenance management platform.

## Start

1. You need to install node and pnpm.

- Node >= 20.0
- pnpm >= 10.0

2. Install the dependencies.

```bash
pnpm install
```

3. Run client.

```bash
npm run ui:dev
```

## Development

### Setup

1. Clone the project.

```bash
git clone https://github.com/robustmq/robustmq-proto.git
```

2. Setup the submodule

```bash
git submodule update --init --recursive
```

3. Install the recommend extensions for VSCode.

4. Develop it.

### Update GRPC interface

1. Use git to update submodule with the following bash:

```bash
git submodule update --remote
```

2. Run generation command to generate code.

```bash
npm run gen:grpc
```
