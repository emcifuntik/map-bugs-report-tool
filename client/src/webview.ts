import { WebView } from "alt-client";

export class UI {
  private webview: WebView;
  private isReady: boolean = false;

  constructor() {
    // this.webview = new WebView('http://resource/client/html/index.html', false);
    this.webview = new WebView('http://localhost:3000', false);
    this.webview.isVisible = false;
    this.webview.on('load', () => {
      this.isReady = true;
    });
  }

  public getView(): WebView {
    return this.webview;
  }

  public isWebViewReady(): boolean {
    return this.isReady;
  }

  public setVisibility(visible: boolean) {
    this.webview.isVisible = visible;
  }

  public setFocused(focused: boolean) {
    this.webview.focused = focused;
  }
}