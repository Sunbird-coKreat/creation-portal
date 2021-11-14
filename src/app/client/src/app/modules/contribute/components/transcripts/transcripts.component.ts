import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transcripts',
  templateUrl: './transcripts.component.html',
  styleUrls: ['./transcripts.component.scss']
})

export class TranscriptsComponent implements OnInit {
  @Input() contentObject;

  public transcriptForm: FormGroup;
  public langControl = "language";
  public languageOptions;

  // @Todo -> contributor/ sourcing reviewer/ contribution reviewer/ sourcing admin/ contribution org admin
  public userRole = "contributor";

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.languageOptions = [
      {name: "English", code: "en"},
      {name: "Hindi", code: "hi"},
      {name: "Assamese", code: "as"},
      {name: "Bengali", code: "bn"},
      {name: "Gujarati", code: "gu"},
      {name: "Kannada", code: "kn"},
      {name: "Malayalam", code: "ml"},
      {name: "Marathi", code: "mr"},
      {name: "Nepali", code: "ne"},
      {name: "Odia", code: "or"},
      {name: "Punjabi", code: "pa"},
      {name: "Tamil", code: "ta"},
      {name: "Telugu", code: "te"},
      {name: "Urdu", code: "ur"},
      {name: "Sanskrit", code: "sa"},
      {name: "Maithili", code: "mai"},
      {name: "Munda", code: "mun"},
      {name: "Santali", code: "sat"},
      {name: "Juang", code: "jun"},
      {name: "Ho", code: "hoc"}
    ];

    this.transcriptForm = this.fb.group({
      transcripts: this.fb.array([
        this.fb.control('')
      ]),
      languages: this.fb.array([
        this.fb.control('')
      ])
    });

  }

  get transcripts() {
    return this.transcriptForm.get('transcripts') as FormArray;
  }

  get languages() {
    return this.transcriptForm.get('languages') as FormArray;
  }

  // 1. Create asset for identifier
  // 2. Create pre-signed url for asset identifier
  // 3. Upload file using pre-signed URL on s3
  // 4. Upload asset using pre-signed URL as file URL
  // 5. Update content using transcript meta property
  attachFile(event, index) {
    const file = event.target.files[0];

    if (!this.fileValidation(file)) {
      return false;
    }

    document.getElementById("attachFileBlock" + index).classList.add("block-hide");
    document.getElementById("selectedFileName" + index).innerText = file.name;
    document.getElementById("replaceFileBlock" + index).classList.remove("block-hide");
  }

  fileValidation(file) {
    // 1. File format validation
    // 2. file size validation
    return true;
  }

  // File validation
  // 1. mimeType validation
  replaceFile(index) {
    document.getElementById("attachFileInput" + index).click();
  }

  reset(index) {
    // @Todo use viewChildern referance instead of id
    document.getElementById("replaceFileBlock" + index).classList.add("block-hide");
    document.getElementById("attachFileBlock" + index).classList.remove("block-hide");
    document.getElementById("selectedFileName" + index).innerText = "";
    (<HTMLInputElement>document.getElementById("attachFileInput" + index)).value = "";
    this.transcripts.controls[index].reset();
  }

  download() {
  }


  addMore() {
    this.transcripts.push(this.fb.control(''));
    this.languages.push(this.fb.control(''));
  }

  languageChange(event) {
    console.log(event);
  }
}
