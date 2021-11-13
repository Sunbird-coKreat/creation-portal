import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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
      {"name": "English", "id": "en"},
      {"name": "Hindi", "id": "hi"}
      // {"language": "Assamese", "languageCode": "as"},
      // {"language": "Bengali", "languageCode": "bn"},
      // {"language": "Gujarati", "languageCode": "gu"},
      // {"language": "Kannada", "languageCode": "kn"},
      // {"language": "Malayalam", "languageCode": "ml"},
      // {"language": "Marathi", "languageCode": "mr"},
      // {"language": "Nepali", "languageCode": "ne"},
      // {"language": "Odia", "languageCode": "or"},
      // {"language": "Punjabi", "languageCode": "pa"},
      // {"language": "Tamil", "languageCode": "ta"},
      // {"language": "Telugu", "languageCode": "te"},
      // {"language": "Urdu", "languageCode": "ur"},
      // {"language": "Sanskrit", "languageCode": "sa"},
      // {"language": "Maithili", "languageCode": "mai"},
      // {"language": "Munda", "languageCode": "mun"},
      // {"language": "Santali", "languageCode": "sat"},
      // {"language": "Juang", "languageCode": "jun"},
      // {"language": "Ho", "languageCode": "hoc"},
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


  // 1. Create asset for identifier
  // 2. Create pre-signed url for asset identifier
  // 3. Upload file using pre-signed URL on s3
  // 4. Upload asset using pre-signed URL as file URL
  // 5. Update content using transcript meta property
  attachFile(e) {
  }

  // File validation
  // 1. mimeType validation
  replace() {

  }

  delete() {

  }

  download() {

  }

  get transcripts() {
    return this.transcriptForm.get('transcripts') as FormArray;
  }

  get languages() {
    return this.transcriptForm.get('languages') as FormArray;
  }

  addMore() {
    this.transcripts.push(this.fb.control(''));
    this.languages.push(this.fb.control(''));
  }

  validate(event) {
    console.log(event);
  }
}
