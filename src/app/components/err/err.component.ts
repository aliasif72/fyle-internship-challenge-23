import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-err',
  templateUrl: './err.component.html',
  styleUrls: ['./err.component.scss'],
})
export class ErrComponent {
  @Input() msg: string = '';
}
