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
  selector: 'scheda-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MyButton
  ],
  templateUrl: './scheda-master.component.html',
  styleUrl: './scheda-master.component.scss'
})
export class SchedaMasterComponent extends vrs implements OnInit {

  @Input() comp!: CompetizioneModel;
  @Input() combo: any;
  eventi_antepost: any
  eventi_girone: any
  step_view: number = 0
  squadre: any = []
  master: any = []
  gironi_disponibili: any = []


  constructor(
    private adminEventi: AdminEventiService,
    private confirmDialogService: ConfirmDialogService,
    private alert: AlertService) {
    super();
  }

  ngOnInit() { }

  ngOnChanges() {

    if (this.comp && this.comp.id) {
      this.getSquadreComp(this.comp.id)
      this.getSchedaMaster()
      this.getTipiPronostici()
    }
  }

  onChangeTipo(event: any) {
    this.step_view = Number(event.target.value) || 0

  }

  onSetEventoAntepost(e: any) {

    let esiste: boolean = this.master.some(
      (i: { gruppo_punti_id: any; }) =>
        i.gruppo_punti_id == e.antepost.id_gruppo_punti);

    if (esiste) {
      this.loading_btn = false
      return;
    }
    let payload = {
      id_comp: this.comp.id,
      categoria: this.step_view,
      view: e.antepost.descrizione,
      gruppo_evento: e.antepost.id_gruppo_punti,
      girone: "",
      data_partita:""
    }


    this.setEventMaster(payload)
  }

  onSetEventoPartita(e: any) {

    let girone = e.squadra_casa.girone && e.squadra_casa.girone == e.squadra_trasferta.girone ? e.squadra_casa.girone : ""
    let partita = e.squadra_casa.descrizione + "-" + e.squadra_trasferta.descrizione;

    let payload = {
      id_comp: this.comp.id,
      categoria: this.step_view,
      view: partita,
      gruppo_evento: 0,
      girone: girone,
      data_partita:e.data_partita+" "+e.ora_partita
    }

    this.setEventMaster(payload)
  }


  onSetEventoGirone(e: any) {

    let esiste: boolean = this.master.some(
      (i: { gruppo_punti_id: string; girone: string; }) =>
        i.gruppo_punti_id == e.evento_girone.id_gruppo_punti
        && i.girone == e.girone);

    if (esiste) {
      this.loading_btn = false
      return;
    }
    let payload = {
      id_comp: this.comp.id,
      categoria: this.step_view,
      view: e.evento_girone.descrizione + " " + e.girone,
      gruppo_evento: e.evento_girone.id_gruppo_punti,
      girone: e.girone,
      data_partita:""
    }
    this.setEventMaster(payload)
  }

  onSetEventoEliminatorie(e: any) {

    let payload = {
      id_comp: this.comp.id,
      categoria: this.step_view,
      view: e.squadra.descrizione,
      gruppo_evento: 0,
      girone: "",
      data_partita:""
    }

    this.setEventMaster(payload)
  }


  getSquadreComp(input: string) {

    this.adminEventi.getSquadreComp(input)
      .pipe(finalize(() =>
        this.loading_btn = false
      ))
      .subscribe({

        next: (result: any) => {
          this.squadre = result.compresi
          this.gironi_disponibili = [...new Set(this.squadre.map((i: { girone: any; }) => i.girone))];
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }


  getSchedaMaster() {

    this.adminEventi.getSchedaMaster(this.comp.id || "0")
      .pipe(finalize(() =>
        this.loading_btn = false
      ))
      .subscribe({

        next: (result: any) => {
          this.master = result
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

  setEventMaster(payload: any) {

    this.adminEventi.setEventMaster(payload)
      .subscribe({

        next: (result: any) => {
          this.getSchedaMaster()

        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

  getTipiPronostici() {

    this.adminEventi.getTipiPronostici(this.comp.id || "0")
      .subscribe({

        next: (result: any) => {
          this.eventi_antepost = result.filter((i: { categoria_id: any; }) => i.categoria_id == this.CATEGORIA.ANTEPOST) || [];
          this.eventi_girone = result.filter((i: { categoria_id: any; }) => i.categoria_id == this.CATEGORIA.GIRONE) || [];
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }


  onDeleteItem(item: any) {

    this.confirmDialogService.confirmGeneric(() => {
      this.delEventMaster(item)
    })
  }


  delEventMaster(payload: any) {

    this.adminEventi.delEventMaster(payload)
      .subscribe({

        next: (result: any) => {
          this.alert.success(SUCCESS_OK);
          this.getSchedaMaster()
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }


}