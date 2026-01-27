declare module '@amap/amap-jsapi-loader' {
  interface LoadOptions {
    key: string;
    version: string;
    plugins?: string[];
    AMapUI?: {
      version: string;
      plugins?: string[];
    };
    Loca?: {
      version: string;
    };
  }

  interface AMapLoader {
    load(options: LoadOptions): Promise<any>;
    reset(): void;
  }

  const loader: AMapLoader;
  export default loader;
}
