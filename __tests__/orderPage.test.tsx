import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderDetails from '@/app/order/[id]/page';

describe('OrderDetails Page', () => {
    const mockParams = Promise.resolve({ id: '1' });

    it('renders the order details without crashing', async () => {
        render(<OrderDetails params={mockParams} />);
        expect(await screen.findByText('Friday')).toBeInTheDocument();
        //expect(screen.getByText('Hosted by Alice')).toBeInTheDocument();
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('displays the participants correctly', async () => {
        render(<OrderDetails params={mockParams} />);
        //expect(await screen.findByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('$25.50')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('$15.75')).toBeInTheDocument();
        //expect(screen.getByText('Charlie')).toBeInTheDocument();
        expect(screen.getByText('$20.00')).toBeInTheDocument();
    });

    it('displays the cart items correctly', async () => {
        render(<OrderDetails params={mockParams} />);
        expect(await screen.findByText('Pizza')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('$15.00')).toBeInTheDocument();
        expect(screen.getByText('Alice, Bob')).toBeInTheDocument();
        expect(screen.getByText('Soda')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('$2.50')).toBeInTheDocument();
        expect(screen.getByText('Salad')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('$8.00')).toBeInTheDocument();
    });

    it('opens the add item modal when the button is clicked', async () => {
        render(<OrderDetails params={mockParams} />);
        const addButton = await screen.findByText('Add Item');
        fireEvent.click(addButton);
        expect(screen.getByText('Add/Edit Item')).toBeInTheDocument();
    });

    it('displays host actions if the user is the host', async () => {
        render(<OrderDetails params={mockParams} />);
        expect(await screen.findByText('Invite Participants')).toBeInTheDocument();
        expect(screen.getByText('Set Cut-Off Time')).toBeInTheDocument();
        expect(screen.getByText('Close Order')).toBeInTheDocument();
    });
});