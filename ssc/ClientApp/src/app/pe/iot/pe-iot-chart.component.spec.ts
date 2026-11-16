import { PeIotChartComponent } from './pe-iot-chart.component';

describe('PeIotChartComponent', () => {
  let component: PeIotChartComponent;

  beforeEach(() => {
    // Komponen tidak memanggil service di konstruktor, cukup instance tanpa DI
    component = new PeIotChartComponent(null as any, null as any, null as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should query the whole selected day', () => {
    const day = new Date(2026, 10, 16);

    const start = (component as any).startOfDay(day) as Date;
    const end = (component as any).endOfDay(day) as Date;

    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(10);
    expect(start.getDate()).toBe(16);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);

    expect(end.getFullYear()).toBe(2026);
    expect(end.getMonth()).toBe(10);
    expect(end.getDate()).toBe(16);
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getSeconds()).toBe(59);
  });
});
