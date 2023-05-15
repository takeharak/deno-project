ARG VARIANT=bullseye
ARG DENO_VERSION=1.33.2

FROM buildpack-deps:${VARIANT}-curl AS download

RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y build-essential \
  && rm -rf /var/lib/apt/lists/*

ARG DENO_VERSION
ENV DENO_VERSION=${DENO_VERSION}

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
  && . $HOME/.cargo/env \
  && cargo install --vers ${DENO_VERSION} --root /usr --locked deno

ARG TINI_VERSION=0.19.0
RUN curl -fsSL https://github.com/krallin/tini/releases/download/v${TINI_VERSION}/tini-$(dpkg --print-architecture) \
    --output /tini \
  && chmod +x /tini

FROM debian:${VARIANT}-slim

RUN mkdir -p /deno-dir/

ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local

ARG DENO_VERSION
ENV DENO_VERSION=${DENO_VERSION}

COPY --from=download /usr/bin/deno /usr/bin/deno
COPY --from=download /tini /tini

WORKDIR /app
COPY . .

RUN mv .devcontainer/docker-entrypoint.sh /usr/local/bin/ \
  && chmod 755 /usr/local/bin/docker-entrypoint.sh

RUN deno cache main.ts

EXPOSE 3000

ENTRYPOINT ["/tini", "--", "docker-entrypoint.sh"]
CMD ["run", "--allow-read", "--allow-write", "--allow-env", "--allow-net", "main.ts"]
