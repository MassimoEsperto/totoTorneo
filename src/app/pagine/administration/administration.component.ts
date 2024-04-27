import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CompetizioneModel } from 'src/app/classi/model/competizione.model';
import { vrs } from 'src/app/classi/util/global-variables';
import { AdminEventiService } from 'src/servizi/admin/admin-eventi.service';
import { AlertService } from 'src/servizi/applicazione/alert.service';
import { UtentiComponent } from './dati/utenti/utenti.component';
import { SquadreComponent } from './dati/squadre/squadre.component';
import { CannonieriComponent } from './dati/cannonieri/cannonieri.component';
import { GestioneSchedeComponent } from './dati/gestione-schede/gestione-schede.component';
import { CompetizioniComponent } from './dati/competizioni/competizioni.component';
import { AssSquadreCompComponent } from './eventi/ass-squadre-comp/ass-squadre-comp.component';
import { AssCannonieriCompComponent } from './eventi/ass-cannonieri-comp/ass-cannonieri-comp.component';
import { AssTipiPronosticiComponent } from './eventi/ass-tipi-pronostici/ass-tipi-pronostici.component';
import { SchedaMasterComponent } from './eventi/scheda-master/scheda-master.component';
import { CalendarioComponent } from './risultati/calendario/calendario.component';
import { EventiModificabiliComponent } from './risultati/eventi-modificabili/eventi-modificabili.component';
import { SchedeConcluseComponent } from './risultati/schede-concluse/schede-concluse.component';
import { RouterModule } from '@angular/router';
import { PAGE } from 'src/environments/costanti';


@Component({
  selector: 'administration',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UtentiComponent,
    SquadreComponent,
    CannonieriComponent,
    GestioneSchedeComponent,
    CompetizioniComponent,
    AssSquadreCompComponent,
    AssCannonieriCompComponent,
    AssTipiPronosticiComponent,
    SchedaMasterComponent,
    CalendarioComponent,
    EventiModificabiliComponent,
    SchedeConcluseComponent

  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss'
})
export class AdministrationComponent extends vrs implements OnInit {

  competizione!: CompetizioneModel;
  combo: any;
  tabs: number = 0;
  PAGE = PAGE;

  constructor(
    private adminEventi: AdminEventiService,
    private alert: AlertService) {
    super();
  }

  ngOnInit() {
    this.getCombo()
    console.log("competizione",this.competizione)
  }

  selected(item: CompetizioneModel) {
    this.competizione = item;
  }

  tabSelected(item: number) {
    this.tabs = item;
  }

  getCombo() {

    this.adminEventi.getCombo()
      .subscribe({

        next: (result: any) => {
          this.combo = result
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }

}
