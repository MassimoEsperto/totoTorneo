import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { vrs } from 'src/app/classi/util/global-variables';
import { MyButton } from 'src/app/componenti/my-button/my-button.component';
import { SUCCESS_OK } from 'src/environments/env';
import { AlertService } from 'src/servizi/applicazione/alert.service';
import { AuthService } from 'src/servizi/autenticazione/auth.service';


@Component({
  selector: 'register',
  standalone: true,
  imports: [
    MyButton,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends vrs implements OnInit {

  @Output() submitto = new EventEmitter();

  constructor(
    private alert: AlertService,
    private auth: AuthService) {
    super();
  }

  ngOnInit(): void {
  }

  onRegister(payload: any) {

    this.loading_btn = true

    this.auth.register(payload)
      .pipe(finalize(() =>
        this.loading_btn = false
      ))
      .subscribe({

        next: (result: any) => {
          this.alert.success(SUCCESS_OK);
          
          this.goToLink(payload)
        },
        error: (error: any) => {
          this.alert.error(error);
        }
      })

  }


  goToLink(payload: any) {

    let tel=393661746386; 
    let testo="Ciao sono "+payload.nome+" "+payload.cognome +
    " con username:"+payload.username +" e mi sono appena iscritto"
    let wa="https://wa.me/"+tel+"?text="+testo
    window.open(wa, "_blank");
    this.submitto.emit(this.LOGIN.SIGN_IN)
  }


}
