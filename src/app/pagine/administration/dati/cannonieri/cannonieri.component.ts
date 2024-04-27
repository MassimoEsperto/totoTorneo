import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { vrs } from 'src/app/classi/util/global-variables';
import { MyButton } from 'src/app/componenti/my-button/my-button.component';
import { SUCCESS_OK } from 'src/environments/env';
import { AdminDatiService } from 'src/servizi/admin/admin-dati.service';
import { AlertService } from 'src/servizi/applicazione/alert.service';
import { ConfirmDialogService } from 'src/servizi/applicazione/confirm-dialog.service';

@Component({
  selector: 'cannonieri',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MyButton
  ],
  templateUrl: './cannonieri.component.html',
  styleUrl: './cannonieri.component.scss'
})
export class CannonieriComponent extends vrs implements OnInit {

  cannonieri: any = []

  constructor(
    private adminDati: AdminDatiService,
    private confirmDialogService: ConfirmDialogService,
    private alert: AlertService) {
    super();
  }

  ngOnInit() {
    this.getCannonieri()
  }


  getCannonieri() {

    this.adminDati.getCannonieri()

      .subscribe({

        next: (result: any) => {
          this.cannonieri = result
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }


  setCannoniere(payload: any) {

    this.loading_btn = true

    this.adminDati.setCannoniere(payload)
      .pipe(finalize(() =>
        this.loading_btn = false
      ))
      .subscribe({

        next: (result: any) => {
          this.alert.success(SUCCESS_OK);
          this.getCannonieri()
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

  onDeleteItem(item: any) {

    this.confirmDialogService.confirmGeneric(() => {
      this.delCannoniere(item)
    })
  }


  delCannoniere(payload: any) {

    this.adminDati.delCannoniere(payload)
      .subscribe({

        next: (result: any) => {
          this.alert.success(SUCCESS_OK);
          this.getCannonieri()
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

}
