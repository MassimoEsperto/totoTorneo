import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CompetizioneModel } from 'src/app/classi/model/competizione.model';
import { vrs } from 'src/app/classi/util/global-variables';
import { MyButton } from 'src/app/componenti/my-button/my-button.component';
import { SUCCESS_OK } from 'src/environments/env';
import { AdminEventiService } from 'src/servizi/admin/admin-eventi.service';
import { AlertService } from 'src/servizi/applicazione/alert.service';
import { ConfirmDialogService } from 'src/servizi/applicazione/confirm-dialog.service';

@Component({
  selector: 'ass-cannonieri-comp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MyButton
  ],
  templateUrl: './ass-cannonieri-comp.component.html',
  styleUrl: './ass-cannonieri-comp.component.scss'
})
export class AssCannonieriCompComponent extends vrs implements OnInit {

  @Input() comp!: CompetizioneModel;
  disponibili: any =[]
  compresi: any=[]

  constructor(
    private adminEventi: AdminEventiService,
    private confirmDialogService: ConfirmDialogService,
    private alert: AlertService) {
    super();
  }

  ngOnInit() { }

  ngOnChanges() {

    if (this.comp&&this.comp.id) {
      this.getCannonieriComp()
    }
  }

  getCannonieriComp() {

    this.adminEventi.getCannonieriComp(this.comp.id||"")
      .pipe(finalize(() =>
        this.loading_btn = false
      ))
      .subscribe({

        next: (result: any) => {
          this.disponibili = result.disponibili
          this.compresi = result.compresi

        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

  submitForm(payload: any) {
    payload.id_comp = this.comp.id
    this.setCannonieriComp(payload)
  }


  setCannonieriComp(payload: any) {


    this.adminEventi.setCannonieriComp(payload)
      .subscribe({

        next: (result: any) => {
          this.getCannonieriComp()
        },
        error: (error: any) => {
          this.loading_btn = false
          this.alert.error(error);
        }
      })

  }

  onDeleteItem(item: any) {

    this.confirmDialogService.confirmGeneric(() => {
      this.delCannoniereComp(item)
    })
  }


  delCannoniereComp(payload: any) {

    this.adminEventi.delCannoniereComp(payload)
      .subscribe({

        next: (result: any) => {
          this.alert.success(SUCCESS_OK);
          this.getCannonieriComp()
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }


}