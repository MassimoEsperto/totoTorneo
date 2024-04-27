import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { EventoSchedaModel } from 'src/app/classi/model/evento.scheda.model';
import { vrs } from 'src/app/classi/util/global-variables';
import { AlertService } from 'src/servizi/applicazione/alert.service';
import { PlayerService } from 'src/servizi/player/player.service';

@Component({
  selector: 'view-scheda',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './view-scheda.component.html',
  styleUrl: './view-scheda.component.scss'
})
export class ViewScheda extends vrs {

  constructor(
    private player: PlayerService,
    private alert: AlertService) {
    super();
  }

  @Input() record!: any;
  scheda_master: Array<EventoSchedaModel> = [];


  ngOnChanges() {
    this.scheda_master = []
    this.loading_page = true
    if (this.record)
      this.getDettaglioScheda(this.record.id)
  }

  getDettaglioScheda(input: string) {

    this.player.getDettaglioScheda(input)
      .pipe(finalize(() =>
        this.loading_page = false
      ))
      .subscribe({

        next: (result: any) => {
          this.scheda_master = result
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

  goToLink(url: string) {
    let id_scheda = this.record.id;
    let utente = this.record.utente;

    window.open(url + "?id_scheda=" + id_scheda + "&utente=" + utente, "_blank");
  }


  ngOnDestroy() {

    document.body.removeAttribute("style");

  }

}
