import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // As fotografias de telemóvel chegam com vários megabytes. O limite por
    // omissão é de um, e uma confeiteira que carregue uma foto normal via o
    // pedido ser recusado sem perceber porquê. Reduzimo-la do lado do
    // servidor logo a seguir, por isso o que entra grande não fica grande.
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
