import { Component, ElementRef, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})

export class FileUploadComponent implements OnInit, ControlValueAccessor {

  onChange: Function;
  file: File | null = null;
  imageURL: string;
  @Output() imageEvent = new EventEmitter<string>();

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event.item(0);
    this.onChange(file);
    this.file = file;

    // image preview
    const reader = new FileReader();

    // triggered each time the reading operation is successfully completed.
    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.imageEvent.emit(this.imageURL);
    }

    // starts reading the contents of the specified Blob
    reader.readAsDataURL(file);

  }

  constructor(private host: ElementRef<HTMLInputElement>) { }

  writeValue(value: null): void {
    // called when the formControl is instantiated
    // when the formControl value changes (patch)
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(onChange: any): void {
    // called whenever the value changes
    // report new value back to the parent form
    this.onChange = onChange;
  }

  registerOnTouched(fn: any): void {
    // called whenever ths UI is interacted with, like a blur event
  }

  ngOnInit(): void {
  }

}
