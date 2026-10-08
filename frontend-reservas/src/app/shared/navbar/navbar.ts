import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly loggedIn = signal(false);
  private readonly authService = inject(MsalService);
  private readonly broadcastService = inject(MsalBroadcastService);

  constructor() {
    this.broadcastService.inProgress$
      .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.loggedIn.set(this.authService.instance.getAllAccounts().length > 0);
      });

    this.broadcastService.msalSubject$
      .pipe(filter((msg) => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe(() => this.loggedIn.set(true));

    this.loggedIn.set(this.authService.instance.getAllAccounts().length > 0);
  }

  protected login(): void {
    this.authService.loginRedirect({ scopes: environment.scopes });
  }

  protected logout(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,
    });
  }
}
