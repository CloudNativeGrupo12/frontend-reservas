import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Icon } from '../icon/icon';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly loggedIn = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly name = signal('');
  protected readonly authError = signal('');
  protected readonly authConfigured =
    !environment.auth.clientId.includes('<') && !environment.auth.authority.includes('<');
  private readonly auth = inject(MsalService);
  private readonly broadcast = inject(MsalBroadcastService);
  constructor() {
    this.broadcast.inProgress$
      .pipe(
        filter((status) => status === InteractionStatus.None),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.updateAccount());
    this.updateAccount();
  }
  private updateAccount(): void {
    const account = this.auth.instance.getActiveAccount() ?? this.auth.instance.getAllAccounts()[0];
    this.loggedIn.set(!!account);
    this.name.set(account?.name ?? account?.username ?? '');
  }
  protected login(): void {
    this.authError.set('');
    if (!this.authConfigured) {
      this.authError.set(
        'El inicio de sesión todavía no está disponible. Contacta al administrador del sistema.',
      );
      return;
    }
    this.auth
      .loginRedirect({ scopes: environment.scopes })
      .subscribe({
        error: () =>
          this.authError.set('No se pudo abrir el inicio de sesión. Inténtalo nuevamente.'),
      });
  }
  protected logout(): void {
    this.auth
      .logoutRedirect({ postLogoutRedirectUri: environment.auth.postLogoutRedirectUri })
      .subscribe({
        error: () => this.authError.set('No se pudo cerrar la sesión. Inténtalo nuevamente.'),
      });
  }
}
