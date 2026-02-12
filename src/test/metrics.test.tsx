import { render, screen, waitFor } from '@testing-library/react';
import { MetricsDashboard } from '../components/ui/MetricsDashboard';
import { Subscription } from '../types/subscription';
import { describe, it, expect, vi } from 'vitest';

// Mock Recharts to avoid canvas issues in tests and focus on data flow
vi.mock('recharts', () => {
    const OriginalModule = vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
        PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
        Pie: ({ data }: any) => (
            <div data-testid="pie">
                {data.map((d: any) => (
                    <div key={d.name} data-testid="pie-slice" data-name={d.name} data-value={d.value} />
                ))}
            </div>
        ),
        BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
        Bar: ({ data }: any) => (
            <div data-testid="bar">
                {/* Bar usually doesn't take data directly in recent Recharts versions if parent has it, 
                    but for this mock we assume data is passed or accessible. 
                    Actually, BarChart takes data. check implementation. 
                    BarChart passes data to Bar. 
                */}
            </div>
        ),
        // Mock other components as simple render-throughs
        Cell: () => null,
        XAxis: () => null,
        YAxis: () => null,
        Tooltip: () => null,
    };
});

describe('MetricsDashboard Integration', () => {
    it('renders and updates with subscription data', async () => {
        const initialSubs: Subscription[] = [
            { id: '1', name: 'Netflix', price: 10, frequency: 'monthly', category: 'ENTERTAINMENT' }
        ];

        const { rerender } = render(<MetricsDashboard subscriptions={initialSubs} />);

        // Check initial render
        expect(screen.getByText('Category Distribution')).toBeInTheDocument();
        const initialSlice = screen.getByTestId('pie-slice');
        expect(initialSlice).toHaveAttribute('data-name', 'ENTERTAINMENT');
        expect(initialSlice).toHaveAttribute('data-value', '10');

        // Update data
        const updatedSubs: Subscription[] = [
            { id: '1', name: 'Netflix', price: 10, frequency: 'monthly', category: 'ENTERTAINMENT' },
            { id: '2', name: 'Spotify', price: 15, frequency: 'monthly', category: 'ENTERTAINMENT' }
        ];

        rerender(<MetricsDashboard subscriptions={updatedSubs} />);

        // Check update
        const updatedSlices = screen.getAllByTestId('pie-slice');
        // Should still be one slice for ENTERTAINMENT, but value 25
        const entertainmentSlice = updatedSlices.find(el => el.getAttribute('data-name') === 'ENTERTAINMENT');
        expect(entertainmentSlice).toHaveAttribute('data-value', '25');
    });

    it('calculates yearly vs monthly correctly', () => {
        const subs: Subscription[] = [
            { id: '1', name: 'Yearly App', price: 120, frequency: 'yearly', category: 'TOOLS' } // 10/mo
        ];
        
        render(<MetricsDashboard subscriptions={subs} />);
        
        const slice = screen.getByTestId('pie-slice');
        expect(slice).toHaveAttribute('data-value', '10');
    });
});
