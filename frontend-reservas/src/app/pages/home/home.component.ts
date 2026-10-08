import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  private readonly authService = inject(MsalService);

  protected readonly accountName = signal<string>('');
  protected readonly loggedIn = this.authService.instance.getAllAccounts().length > 0;

  constructor() {
    const account =
      this.authService.instance.getActiveAccount() ?? this.authService.instance.getAllAccounts()[0];
    this.accountName.set(account?.name ?? account?.username ?? '');
  }
}
