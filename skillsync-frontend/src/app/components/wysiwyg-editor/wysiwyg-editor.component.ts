import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-wysiwyg-editor',
  template: `
    <angular-editor
      [(ngModel)]="content"
      [config]="editorConfig"
      (ngModelChange)="contentChanged.emit($event)">
    </angular-editor>
  `
})
export class WysiwygEditorComponent {
  @Input() content: string = '';
  @Output() contentChanged = new EventEmitter<string>();

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '200px',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
}