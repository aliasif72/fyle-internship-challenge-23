import { Component, Input, Output, EventEmitter } from '@angular/core';

type userType = {
  username: string;
  url: string;
  bio: string;
  location: string;
  totalRepos: number;
};
type repoType = {
  repoName: string;
  description: string;
  languages: string[];
}[];

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  staticStyle: string =
    'inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2';
  @Input() repository: repoType = [];
  @Input() user: any;
  @Input() githubUsername: string = '';
  pageSize: number = 10;
  @Input() next: boolean = true;
  @Input() pageNo: number = 1;
  product: number = this.pageSize * this.pageNo;
  @Output() parentNavFun = new EventEmitter();
  paginationStyle: string =
    'relative block rounded cursor-pointer bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white';
  prevBtn: string =
    'relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400';

  constructor() {}

  eventPageSize(value: string): void {
    this.pageSize = parseInt(value);
    this.parentNavFun.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  prevHandler() {
    this.pageNo > 1 ? (this.pageNo -= 1) : {};
    this.parentNavFun.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  nextHandler() {
    this.pageNo += 1;
    this.parentNavFun.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }
}
