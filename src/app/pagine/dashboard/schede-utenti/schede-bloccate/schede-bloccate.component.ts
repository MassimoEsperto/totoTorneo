import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { EventoSchedaModel } from 'src/app/classi/model/evento.scheda.model';
import { vrs } from 'src/app/classi/util/global-variables';
import { ViewScheda } from 'src/app/componenti/my-form-modal/view-scheda/view-scheda.component';
import { MySpinner } from 'src/app/componenti/my-spinner/my-spinner.component';
import { AlertService } from 'src/servizi/applicazione/alert.service';
import { PlayerService } from 'src/servizi/player/player.service';

@Component({
  selector: 'schede-bloccate',
  standalone: true,
  imports: [
    MySpinner,
    CommonModule,
    ViewScheda
  ],
  templateUrl: './schede-bloccate.component.html',
  styleUrls: ['./schede-bloccate.component.scss']
})
export class SchedeBloccateComponent extends vrs implements OnInit {

  record: any

  constructor(
    private player: PlayerService,
    private alert: AlertService) {
    super();
  }


  scheda_master: Array<EventoSchedaModel> = [];
  schede: any

  play_comp = this.player.getCompetizione()

  ngOnInit() {
    this.loading_table = true
    this.getSchedeUtente()
  }



  onViewItem(item: any) {
    this.record = item
  }



  getSchedeUtente() {

    this.player.getSchedeUtente()
      .pipe(finalize(() =>
        this.loading_table = false
      ))
      .subscribe({

        next: (result: any) => {
          this.schede = result
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

  




}
