import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { EventoSchedaModel } from 'src/app/classi/model/evento.scheda.model';
import { vrs } from 'src/app/classi/util/global-variables';
import { AlertService } from 'src/servizi/applicazione/alert.service';
import { PlayerService } from 'src/servizi/player/player.service';
import { MyButton } from '../../my-button/my-button.component';


@Component({
  selector: 'form-scheda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MyButton
  ],
  templateUrl: './form-scheda.component.html',
  styleUrl: './form-scheda.component.scss'
})
export class FormScheda extends vrs implements OnInit {


  @Input() combo!: any;
  @Input() scheda_selezionata: number = 0;
  @ViewChild('closeModal') closeModal!: ElementRef;
  @Input() scheda_master: Array<EventoSchedaModel> = [];
  @Output() submit = new EventEmitter();
  play_comp = this.player.getCompetizione()


  constructor(
    private player: PlayerService,
    private alert: AlertService) {
    super();
  }

  ngOnInit() { }

  ngOnChanges() {

  }


  onChangeGruppo(event: any, record: any) {

    let ele = event.target.value['0']

    //nel caso non ci sia un girone completo
    let completo = this.scheda_master.find((i: { categoria: number, girone: string, gruppo: number }) => i.categoria == this.CATEGORIA.GIRONE && i.girone == record.girone && i.gruppo == this.GRUPPO_PUNTI.GIRONE_COMPLETO)
    if (!completo) return

    completo.valore = ''

    //lista di prima seconda ecc
    let lista = this.scheda_master.filter((i: { categoria: number, girone: string, gruppo: number }) => i.categoria == this.CATEGORIA.GIRONE && i.girone == record.girone && i.gruppo != this.GRUPPO_PUNTI.GIRONE_COMPLETO)

    //nel caso qualche campo non sia stato valorizzato tipo prima girone seconda ecc
    let is_da_valorizzare = lista.some((i: { valore: string }) => !i.valore)

    if (is_da_valorizzare) return


    let tmp: any[] = []
    let sigle = "";
    let sep = "";
    for (let ele of lista) {
      if (ele.valore && !tmp.some((i) => i == ele.valore)) {
        tmp.push(ele.valore)
        let sigla = this.combo.squadre_girone[record.girone].find((i: { descrizione: string }) => i.descrizione == ele.valore).sigla
        sigle = sigle + sep + sigla
        sep = "-"
      }
    }

    //nel caso tutto sia andato a buon fine
    if (lista.length == tmp.length) {
      completo.valore = sigle
    }

  }

  onChangeTabellone(event: any, record: any) {

    let ele = event.target.value['0']

    //lista di quarti ottavi eccc
    let lista = this.scheda_master.filter((i: { categoria: number }) => i.categoria == this.CATEGORIA.ELIMINATORIE)

    let is_da_valorizzare = lista.some((i: { valore: string }) => !i.valore)

    let sigle = "";

    if (is_da_valorizzare) return

    let completo = this.scheda_master.find((i: { gruppo: number }) => i.gruppo == this.GRUPPO_PUNTI.TABELLONE_COMPLETO)
    if (!completo) return

    completo.valore = "";

    for (let item of this.combo.tabellone) {

      let eventi = lista.filter((i: { valore: string }) => i.valore == item.descrizione);

      if (eventi && eventi.length > item.max) {
        return
      }


    }

    for (let ele of lista) {
      let sigla = this.combo.tabellone.find((i: { descrizione: string }) => i.descrizione == ele.valore).sigla
      sigle += sigla
    }

    completo.valore = sigle;


  }


  onPlayScheda(input: Array<EventoSchedaModel>) {

    this.loading_btn = true

    if (this.scheda_selezionata > 0) {
      this.updDettaglioScheda(input)
    } else {
      this.setDettaglioScheda(input)
    }

  }



  updDettaglioScheda(input: Array<EventoSchedaModel>) {


    this.player.updDettaglioScheda(input)
      .pipe(finalize(() =>
        this.loading_btn = false
      ))
      .subscribe({

        next: (result: any) => {
          this.closeModal.nativeElement.click()
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }


  setDettaglioScheda(input: Array<EventoSchedaModel>) {

    this.player.setDettaglioScheda(input)
      .pipe(finalize(() =>
        this.loading_btn = false
      ))
      .subscribe({

        next: (result: any) => {
          this.closeModal.nativeElement.click()
          this.submit.emit()
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

  ngOnDestroy() {

    document.body.removeAttribute("style");

  }


}
