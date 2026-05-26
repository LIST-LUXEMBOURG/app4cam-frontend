import type { MockInstance } from 'vitest'

type ChartMock = ReturnType<typeof vi.fn> & { register: MockInstance }

export const Chart = vi.fn().mockImplementation(function (this: {
  data: object
  options: object
  update: ReturnType<typeof vi.fn>
}) {
  this.data = { datasets: { push: vi.fn() } }
  this.options = { scales: { x: { max: 0 } } }
  this.update = vi.fn()
}) as ChartMock

Chart.register = vi.fn()
