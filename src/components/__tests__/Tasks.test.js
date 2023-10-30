import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { Tasks } from '../Tasks';

const mockItem = {
    id: 2,
    isComplete: false,
    name: 'test-name'
};

const mockAddItem = jest.fn();
const mockGetItems = jest.fn();
const mockDeleteItem = jest.fn();
const mockUpdateItem = jest.fn();

jest.mock('../../api', () => ({
    addItem: (item) => mockAddItem(item),
    getItems: () => mockGetItems.mockReturnValue([]),
    deleteItem: (id) => mockDeleteItem(id),
    updateItem: (item) => mockUpdateItem(item),
}));

const helper = () => {
    const input = screen.getByPlaceholderText('new to-do');
    const submitButton = screen.getByRole('button', { name: 'ADD' });

    userEvent.type(input, 'Test to-do');
    userEvent.click(submitButton);
};

beforeEach(() => mockAddItem.mockReturnValue(mockItem));

// --------------------------------------------------------------------------

describe('Tasks', () => {
    it('renders correctly', async () => {
        render(<Tasks />);

        expect(await screen.findByText('Add new task:')).toBeInTheDocument();
    })

    it('should add an item and reset the new task form after filling the form and clicking add', async () => {
        render(<Tasks />);

        expect(await screen.findByText('Add new task:')).toBeInTheDocument();
        
        // helper()
        const input = screen.getByPlaceholderText('new to-do');
        const submitButton = screen.getByRole('button', { name: 'ADD' });

        userEvent.type(input, 'Test to-do');
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockAddItem).toHaveBeenCalledWith({
                isComplete: false,
                name: "Test to-do"
            });
        });

        expect(input.value).toBe('');
        expect(await screen.findByText('test-name')).toBeInTheDocument();
    })

    it('should delete an item when clicking delete', async () => {
        // setup

        render(<Tasks />);

        expect(await screen.findByText('Add new task:')).toBeInTheDocument();

        helper();

        expect(await screen.findByText('test-name')).toBeInTheDocument();

        // end of setup

        const deleteButton = screen.getByRole('button', { name: 'Delete' });

        userEvent.click(deleteButton);

        expect(mockDeleteItem).toHaveBeenCalledWith(2);
        expect(await screen.findByText('test-name')).not.toBeInTheDocument();
    })

    it('should show edit form when clicking edit', async () => {
        // setup
        
        render(<Tasks />);

        expect(await screen.findByText('Add new task:')).toBeInTheDocument();

        helper();

        expect(await screen.findByText('test-name')).toBeInTheDocument();

        // end of setup

        const editButton = screen.getByRole('button', { name: 'Edit' });

        userEvent.click(editButton);

        expect(await screen.findByTestId('editInput')).toBeInTheDocument();
    })

    it('should save changes when clicking tick after editing', async() => {
        // setup

        render(<Tasks />);

        expect(await screen.findByText('Add new task:')).toBeInTheDocument();

        helper();

        expect(await screen.findByText('test-name')).toBeInTheDocument();

        const editButton = screen.getByRole('button', { name: 'Edit' });

        userEvent.click(editButton);

        expect(await screen.findByTestId('editInput')).toBeInTheDocument();
        
        // end of setup

        const updatedMockItem = {...mockItem, name: 'new-test-name'};

        const changeInput = screen.getByTestId('editInput');
        const submitChanges = screen.getByRole('button', { name: '✓' });

        userEvent.clear(changeInput);
        userEvent.type(changeInput, 'new-test-name');
        userEvent.click(submitChanges);

        expect(mockUpdateItem).toHaveBeenCalledWith(updatedMockItem);
        expect(await screen.findByText('new-test-name')).toBeInTheDocument();
    })
})