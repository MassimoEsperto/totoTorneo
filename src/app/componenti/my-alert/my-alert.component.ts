import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/servizi/applicazione/alert.service';


@Component({
  selector: 'my-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-alert.component.html',
  styleUrl: './my-alert.component.scss'
})
export class MyAlert implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription;
  message: any;

  constructor(private alert: AlertService) { }

  ngOnInit() {
      this.subscription = this.alert.getAlert()
          .subscribe(message => {
              switch (message && message.type) {
                  case 'success':
                      message.cssClass = 'text-white bg-success';
                      break;
                  case 'error':
                      message.cssClass = 'text-white bg-danger';
                      break;
              }

              this.message = message;
          });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  closeAlert() {
      this.alert.clear()
  }
}
