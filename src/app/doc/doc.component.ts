import { Component, OnInit } from '@angular/core';
import { DocService } from '../service/doc.service';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css']
})
export class DocComponent implements OnInit {

  documentContent: string;

  constructor(private docService: DocService) {}

  ngOnInit(): void {
    this.docService.getDocumentContent().subscribe(content => {
      this.documentContent = content;
    });
  }

}
 