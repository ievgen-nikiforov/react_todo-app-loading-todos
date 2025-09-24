/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {

  const [todos, setTodos] = useState<Todo[]>([]);
  const completedTodosNumber = todos.filter(todo => !todo.completed).length;
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [showError, setShowError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const closeError=()=>{
    setShowError(false)
  }
  const fetchTodos = async () => {
    setShowError(false)
    try{
    const data: Todo[] = await getTodos();
    setTodos(data);
    } catch(error){
      setShowError(true)
      setErrorMessage('Unable to load todos');
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  if (!USER_ID) {
    return <UserWarning />;
  }
  const selectNewFilter = (newFilter: string) => {
    setSelectedFilter(newFilter);
    switch (newFilter) {
      case 'All':
        setFilteredTodos(todos);
        break;
      case 'Active':
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case 'Completed':
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      default:
        setFilteredTodos(todos);
    }
  };
    useEffect(() => selectNewFilter(selectedFilter), [todos]);
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {filteredTodos.map((todo, key) => (
            <div
              key={key}
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {/* This todo is an active todo */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Not Completed Todo
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is being edited */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            {/* This form is shown instead of the title and remove button */}
          {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>  */}
          {/* This todo is in loadind state */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            {/* 'is-active' class puts this modal on top of the todo */}
          {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>  */}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {completedTodosNumber} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={() => selectNewFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => selectNewFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => selectNewFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        ) : (
          ''
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {showError&&(<div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button data-cy="HideErrorButton" type="button" className="delete" onClick={()=>closeError()} />
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>)}
    </div>
  );
};
