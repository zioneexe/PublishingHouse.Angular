import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appOrderStatus]'
})
export class OrderStatusDirective implements OnInit {
  @Input('appOrderStatus') status: 'Pending' | 'Completed' | 'Cancelled' | 'In Progress' | 'On Hold' = 'Pending';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const statusStyles = this.getStatusStyles(this.status);
    this.applyStyles(statusStyles);
  }

  private getStatusStyles(status: string) {
    switch (status) {
      case 'Pending':
        return { color: 'orange', backgroundColor: '#fff3cd', border: '1px solid #ffecb5' };
      case 'Completed':
        return { color: 'green', backgroundColor: '#d4edda', border: '1px solid #c3e6cb' };
      case 'Cancelled':
        return { color: 'red', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb' };
      case 'In Progress':
        return { color: 'blue', backgroundColor: '#d1ecf1', border: '1px solid #bee5eb' };
      case 'On Hold':
        return { color: 'gray', backgroundColor: '#e2e3e5', border: '1px solid #d6d8db' };
      default:
        return { color: 'black', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' };
    }
  }

  private applyStyles(styles: { [key: string]: string }): void {
    Object.keys(styles).forEach(styleKey => {
      this.renderer.setStyle(this.el.nativeElement, styleKey, styles[styleKey]);
    });
    this.renderer.setStyle(this.el.nativeElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.el.nativeElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-block');
    this.renderer.setStyle(this.el.nativeElement, 'fontWeight', 'bold');
  }
}
