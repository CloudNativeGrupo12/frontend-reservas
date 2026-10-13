import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminRabbitmqComponent } from './admin-rabbitmq.component';
import { AdminRabbitmqService } from '../../services/admin-rabbitmq.service';

describe('Administración de recursos de mensajería', () => {
  it('confirma una creación con el contrato REST nuevo, sin un campo status', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AdminRabbitmqService,
          useValue: {
            crearCola: () => of({ name: 'prueba.cola', durable: true }),
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(AdminRabbitmqComponent);
    const component = fixture.componentInstance as unknown as {
      queueForm: { setValue(value: unknown): void };
      crearCola(): void;
    };
    component.queueForm.setValue({ name: 'prueba.cola', durable: true });
    component.crearCola();
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')?.textContent,
    ).toContain('creada correctamente');
  });
  it('espera confirmación y elimina el nombre seleccionado originalmente', () => {
    const removed: string[] = [];
    const service = {
      eliminarCola: (name: string) => {
        removed.push(name);
        return of(undefined);
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
