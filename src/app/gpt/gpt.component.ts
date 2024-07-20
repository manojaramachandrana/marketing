import { Component, OnInit } from '@angular/core';
import { GptService } from '../service/gpt.service';

@Component({
  selector: 'app-gpt',
  templateUrl: './gpt.component.html',
  styleUrls: ['./gpt.component.css']
})
export class GptComponent implements OnInit {

  response: any;

  constructor(private gptService: GptService) {}

  ngOnInit(): void {}

  queryGpt(prompt: string): void {
    this.gptService.queryGptModel(prompt).subscribe(response => {
      this.response = response;
    });
  }

}
