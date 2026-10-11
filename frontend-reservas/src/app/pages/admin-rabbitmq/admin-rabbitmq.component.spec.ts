import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminRabbitmqComponent } from './admin-rabbitmq.component';
import { AdminRabbitmqService } from '../../services/admin-rabbitmq.service';

describe('Eliminación de recursos de mensajería', () => {
  it('espera confirmación y elimina el nombre seleccionado originalmente', () => {
    const removed: string[] = [];
    const service = {
      eliminarCola: (name: string) => {
        removed.push(name);
        return of({ status: 'OK', mensaje: 'eliminada' });
      },
    };
    TestBed.configureTestingModule({
      providers: [{ provide: AdminRabbitmqService, useValue: service }],
    });
    const page = TestBed.createComponent(AdminRabbitmqComponent).componentInstance;
    page.eliminarCola(' prueba.cola ');
    expect(removed).toEqual([]);
    page.confirmarEliminacion();
    expect(removed).toEqual(['prueba.cola']);
  });
  it('rechaza un nombre vacío', () => {
    let calls = 0;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AdminRabbitmqService,
          useValue: {
            eliminarCola: () => {
              calls++;
              return of({ status: 'OK' });
            },
          },
        },
      ],
    });
    const page = TestBed.createComponent(AdminRabbitmqComponent).componentInstance;
    page.eliminarCola('   ');
    page.confirmarEliminacion();
    expect(calls).toBe(0);
  });
});
