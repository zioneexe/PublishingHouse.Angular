import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appShowIfNotEmpty]'
})
export class ShowIfNotEmptyDirective {
  private hasView = false;

  @Input('appShowIfNotEmpty') set collection(collection: any[] | null | undefined) {
    if (collection && collection.length > 0) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      this.viewContainer.clear();
      this.hasView = false;
      if (this.emptyTemplateRef) {
        this.viewContainer.createEmbeddedView(this.emptyTemplateRef);
      }
    }
  }

  @Input('appShowIfNotEmptyElse') emptyTemplateRef?: TemplateRef<any>;

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}
}
