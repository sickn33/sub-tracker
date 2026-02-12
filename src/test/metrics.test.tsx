import { render, screen } from '@testing-library/react';
import { MetricsDashboard } from '../components/ui/MetricsDashboard';
import { type Subscription } from '../types/subscription';
import { describe, it, expect, vi } from 'vitest';

// Mock Recharts to avoid canvas issues in tests and focus on data flow
vi.mock('recharts', () => {
    return {
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
        PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
        Pie: ({ data }: { data: Array<{ name: string; value: number }> }) => (
            <div data-testid="pie">
                {data.map((d) => (
                    <div key={d.name} data-testid="pie-slice" data-name={d.name} data-value={d.value} />
                ))}
            </div>
        ),
        BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
        Bar: () => (
            <div data-testid="bar" />
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

    it('merges categories with different casing', () => {
        const subs: Subscription[] = [
            { id: '1', name: 'App 1', price: 10, frequency: 'monthly', category: 'Entertainment' },
            { id: '2', name: 'App 2', price: 20, frequency: 'monthly', category: 'ENTERTAINMENT' }
        ];

        render(<MetricsDashboard subscriptions={subs} />);
        
        // Should produce single slice with value 30
        const slices = screen.getAllByTestId('pie-slice');
        expect(slices).toHaveLength(1);
        expect(slices[0]).toHaveAttribute('data-name', 'ENTERTAINMENT');
        expect(slices[0]).toHaveAttribute('data-value', '30');
    });
});
