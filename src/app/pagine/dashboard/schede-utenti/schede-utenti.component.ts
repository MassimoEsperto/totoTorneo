import { Component, OnInit } from '@angular/core';
import { vrs } from 'src/app/classi/util/global-variables';
import { PlayerService } from 'src/servizi/player/player.service';
import { SchedeBloccateComponent } from './schede-bloccate/schede-bloccate.component';
import { SchedeSbloccateComponent } from './schede-sbloccate/schede-sbloccate.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'schede-utenti',
  standalone: true,
  imports: [
    CommonModule,
    SchedeBloccateComponent,
    SchedeSbloccateComponent
  ],
  templateUrl: './schede-utenti.component.html',
  styleUrl: './schede-utenti.component.scss'
})
export class SchedeUtentiComponent extends vrs implements OnInit {


  constructor(
    private player: PlayerService) {
    super();
  }

  
  play_comp = this.player.getCompetizione()

  ngOnInit() {}

 

}
