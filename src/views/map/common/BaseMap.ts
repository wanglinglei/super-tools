const mapKey = import.meta.env.VITE_AMAP_KEY;
const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_JS_CODE;
import AMapLoader from '@amap/amap-jsapi-loader';
import { mapDefaultConfig } from './constants';
import type { BaseMapProps } from './types';

class BaseMap {
  private map: any = null;
  private AMap: any = null;
  private mapOptions: BaseMapProps;
  private initPromise: Promise<void> | null = null;

  constructor(baseMapProps: BaseMapProps) {
    this.mapOptions = baseMapProps;
    this.initPromise = this.initMap();
  }

  /**
   * @description: 初始化地图
   */
  private async initMap(): Promise<void> {
    const { containerId, baseMapConfig = {} } = this.mapOptions;
    
    // 设置安全密钥
    (window as any)._AMapSecurityConfig = {
      securityJsCode: securityJsCode,
    };
    
    this.AMap = await AMapLoader.load({
      key: mapKey,
      version: '2.0',
      plugins: [
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.Geocoder',
        'AMap.Weather',
      ],
    });
    const { zoom, center, viewMode } = { ...mapDefaultConfig, ...baseMapConfig };
    this.map = new this.AMap.Map(containerId, {
      zoom,
      center,
      viewMode,
    });

    // 添加默认控件
    this.map.addControl(new this.AMap.Scale());
    this.map.addControl(new this.AMap.ToolBar({ position: 'RT' }));
  }

  /**
   * @description: 等待地图初始化完成
   */
  async ready(): Promise<void> {
    await this.initPromise;
  }

  /**
   * @description: 获取地图实例
   */
  getMap(): any {
    return this.map;
  }

  /**
   * @description: 获取 AMap 构造器
   */
  getAMap(): any {
    return this.AMap;
  }

  /**
   * @description: 添加地图控件
   */
  addControl(control: any): void {
    this.map?.addControl(control);
  }

  /**
   * @description: 监听地图事件
   */
  on(event: string, handler: (...args: any[]) => void): void {
    this.map?.on(event, handler);
  }

  /**
   * @description: 移除地图上的覆盖物
   */
  remove(overlay: any): void {
    this.map?.remove(overlay);
  }

  /**
   * @description: 设置地图视野自适应
   */
  setFitView(overlays: any[], immediately?: boolean, avoid?: number[]): void {
    this.map?.setFitView(overlays, immediately, avoid);
  }

  /**
   * @description: 清除地图覆盖物
   */
  clearMap(): void {
    this.map?.clearMap();
  }

  /**
   * @description: 销毁地图实例
   */
  destroy(): void {
    this.map?.destroy();
    this.map = null;
    this.AMap = null;
  }
}

export default BaseMap;
