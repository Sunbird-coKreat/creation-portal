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
      {"language": "English", "languageCode": "en"},
      {"language": "Hindi", "languageCode": "en"},
      {"language": "Bengali", "languageCode": "en"},
      {"language": "Gujarati", "languageCode": "en"},
      {"language": "Kannada", "languageCode": "en"},
      {"language": "Malayalam", "languageCode": "en"},
      {"language": "Marathi", "languageCode": "en"},
      {"language": "Nepali", "languageCode": "en"},
      {"language": "Odia", "languageCode": "en"},
      {"language": "Punjabi", "languageCode": "en"},
      {"language": "Tamil", "languageCode": "en"},
      {"language": "Telugu", "languageCode": "en"},
      "Hindi",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Urdu",
      "Sanskrit",
      "Maithili",
      "Munda",
      "Santali",
      "Juang",
      "Ho",
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

  validate() {

  }
}
