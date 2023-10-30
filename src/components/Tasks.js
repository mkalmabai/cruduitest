import { useState, useEffect } from 'react';
import styled from 'styled-components';

import { addItem as addItemApi, getItems as getItemsApi, deleteItem as deleteItemApi, updateItem as updateItemApi } from '../api/index.js' 

export const Tasks = () => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [todoItems, setTodoItems] = useState([]);

    const [newTodoName, setNewTodoName] = useState('');
    const [visible, setVisible] = useState(false);

    const initial = {name: '', id: '', isComplete: false};

    const [tempItem, setTempItem] = useState(initial);

    const getItems = async () => {
        setIsLoaded(false);
        try {
            const result = await getItemsApi();
            setTodoItems(result);
        } catch (e) {
            setError(`Error getting items: ${e}`);
        }
        setIsLoaded(true);
    };

    const addItem = async () => {
        const item = {
            isComplete: false,
            name: newTodoName.trim(),
        };

        try {
            const result = await addItemApi(item);
            setTodoItems([...todoItems, { ...result }]);
            setNewTodoName('');
        } catch (e) {
            setError(`Error adding item: ${e}`);
        }
    };

    const deleteItem = async (id) => {
        try {
            await deleteItemApi(id);
            setTodoItems(todoItems.filter(match => match.id !== id));
        } catch (e) {
            setError(`Error deleting item: ${e}`);
        }
    }

    const displayEditForm = id => {
        setTempItem(todoItems.find(item => item.id === id));
        setVisible(true);
    };

    const updateItem = async () => {
        const item = {
            id: parseInt(tempItem.id, 10),
            isComplete: tempItem.isComplete,
            name: tempItem.name.trim()
        };

        try {
            await updateItemApi(item);
            setTodoItems(todoItems.map(obj => {
                return obj.id === item.id ? item : obj;
            }));
        } catch (e) {
            setError(`Error updating item: ${e}`);
        };

        handleReset();
    };

    useEffect(() => {
        getItems();
    }, []);

    const handleReset = () => {
        setVisible(false);
        setTempItem(initial);
    };

    if (error) {
        return <div><p>{error}</p></div>
    } else if (!isLoaded) {
        return <div><p>Loading...</p></div>
    } else {
        return (
            <Main>
                <Wrapper>
                    <Header>To-do CRUD</Header>
                    <Form method="POST" onSubmit={(e) => {e.preventDefault(); addItem()}}>
                        <Label htmlFor="add">Add new task:</Label>
                        <InputAdd 
                            id="add"
                            type="text" 
                            placeholder="new to-do" 
                            value={newTodoName} 
                            onChange={(e) => setNewTodoName(e.target.value)}
                            required
                        />
                        <AddButton type="submit">ADD</AddButton>
                    </Form>
                </Wrapper>

                <TodoContainer>
                    <TodoCount>
                        {todoItems.length} {todoItems.length === 1 ? 'to-do' : 'to-dos'}
                    </TodoCount>

                    <TodoList>
                        <Grid>
                            <GridHeader>Is Complete?</GridHeader>
                            <GridHeader>Name</GridHeader>
                        </Grid>
                            {todoItems.map(item => 
                                <div key={item.id}>
                                    {tempItem.id === item.id &&
                                        <GridForm onSubmit={(e) => {e.preventDefault(); updateItem()}}>
                                            <Input type="hidden" 
                                                value={tempItem.id}
                                            />
                                            <label htmlFor="isComplete">
                                            <Input 
                                                id="isComplete"
                                                type="checkbox" 
                                                checked={tempItem.isComplete} 
                                                onChange={(e) => setTempItem({...tempItem, isComplete: e.target.checked})}
                                            />
                                            </label>
                                            <label htmlFor="editTodoName">
                                            <InputEdit 
                                                id="editTodoName"
                                                type="text" 
                                                value={tempItem.name} 
                                                onChange={(e) => setTempItem({...tempItem, name: e.target.value})}
                                                required
                                                data-testid="editInput"
                                            />
                                            </label>
                                            <Button 
                                                type="submit" 
                                                pointer={visible ? true : false}
                                            >&#10003;</Button>
                                            <Button 
                                                type="reset" 
                                                onClick={handleReset} 
                                                aria-label="Close" 
                                                pointer={visible ? true : false}
                                            >&#10006;</Button>
                                        </GridForm>
                                    }
                                    {tempItem.id !== item.id &&
                                        <GridItem>
                                            <Input type="checkbox" disabled={true} checked={item.isComplete}/>
                                            <Span faded={visible ? true : false}>{item.name ? item.name : ""}</Span>
                                            <Button onClick={() => displayEditForm(item.id)} disabled={visible ? true : false}>Edit</Button>
                                            <Button onClick={() => deleteItem(item.id)} disabled={visible ? true : false}>Delete</Button>
                                        </GridItem>
                                    }
                                </div>
                            )}
                    </TodoList>
                </TodoContainer>
            </Main>
        );
    };
};

const Main = styled.main`
    font-family: 'Patrick Hand SC', cursive;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 92vh;

    @media only screen and (max-width: 980px) {
        flex-direction: column;
        height: auto;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;
    text-align: center;

    @media only screen and (max-width: 980px) {
        width: 100%;
    }
`;

const Header = styled.h1`
    font-size: 4em;
    margin: 0em;
    margin-top: 0.5em;
    color: white;
    text-shadow: 5px 5px black;
`;

const Form = styled.form`
    margin: 0.5em 0em;
`;

const Label = styled.label`
    display: block;
    font-size: 2em;
    color: white;
    text-shadow: 3px 3px black;
`;

const Input = styled.input`
    display: inline-block;
    border: none;
    font-size: 1em;
    height: 2em;
    vertical-align: middle;
    margin: auto;
`;

const InputAdd = styled(Input)`
    font-size: 1.5em;
    padding-left: 0.25em;

    @media only screen and (max-width: 365px) {
        font-size: 1em;
        width: 100%;
        height: 4em;
    }
`;

const InputEdit = styled(Input)`
    font-family: 'Patrick Hand SC', cursive;
    width: 100%;
    height: 90%;
    text-align: center;
    border: 1px solid black;
    margin: auto;
    font-size: 1.25em;
`;

const Button = styled.button`
    width: fit-content;
    height: fit-content;
    margin: auto;
    cursor: ${props => props.pointer || !props.disabled ? "pointer" : "default"};

    @media only screen and (max-width: 300px) {
        padding: 1em 2em;
        margin-top: 1em;
    }
`;

const AddButton = styled.button`
    font-size: 1em;
    padding: 0.95em;
    border-style: none;
    vertical-align: middle;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        color: white;
        background-color: #88aa00;
    }

    @media only screen and (max-width: 365px) {
        width: 100%;
    }
`;

const TodoContainer = styled(Wrapper)`
    width: 35%;
    max-width: 35em;
    margin-right: 1em;
    order: -1;

    @media only screen and (max-width: 980px) {
        order: 1;
        margin-right: 0em;
        padding-bottom: 3em;
    }
`;

const TodoCount = styled.p`
    margin: 0.5em;
    font-size: 2em;
    color: white;
`;

const TodoList = styled.div`
    background-color: white;
    padding-top: 1em;
    padding-bottom: 4em;
    min-height: 600px;
    box-shadow: 5px 10px grey;

    @media only screen and (max-width: 300px) {
        box-shadow: 0px 10px grey;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1fr;
    width: 95%;
    margin: 0 auto;
    border-bottom: 1px solid black;

    @media only screen and (max-width: 300px) {
        grid-template-columns: 1fr 1fr;
    }
`;

const GridHeader = styled.h4`
    margin: 0;
`;

const GridForm = styled.form`
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1fr;
    width: 95%;
    margin: 0 auto;
    border-bottom: 1px solid red;
`;

const GridItem = styled(Grid)`
    border-bottom: 1px solid red;
`;

const Span = styled.span`
    opacity: ${props => props.faded ? "50%" : "100%"};
    font-size: 1.25em;
    word-wrap: break-word;
    max-width: 8em;
`;