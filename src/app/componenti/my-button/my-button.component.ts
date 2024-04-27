import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmDialogService } from 'src/servizi/applicazione/confirm-dialog.service';


@Component({
  selector: 'my-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-button.component.html',
  styleUrl: './my-button.component.scss'
})
export class MyButton implements OnInit {

  //parametri di input valorizzati di default
  @Output() myClick = new EventEmitter();

  @Input() submit = false;
  @Input() disabled = false;
  @Input() confirm = false;
  @Input() color: string = "btn-primary";
  @Input() label: string = "Clicca";
  @Input() block = false;
  @Input() loading = false;
  type: string = "button";
  message: any;

  constructor(private confirmDialogService: ConfirmDialogService) { }

  ngOnInit() {
    this.type = this.submit ? "submit" : "button";
  }

  ngOnChanges() {}

  showDialog() {

    this.confirmDialogService.confirmThis("Sei sicuro di voler effettuare l'operazione?", () => {
      this.myClick.emit()
    })
  }


}
