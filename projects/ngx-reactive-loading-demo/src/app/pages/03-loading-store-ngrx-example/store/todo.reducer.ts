import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../../model/todo';
import todoActions from './todo.actions';
import { TodoUtils } from '../../../helpers/todo-utils';

export interface TodoState {
  ids: string[];
  todos: Record<string, Todo>;
}

const initialState: TodoState = {
  ids: [],
  todos: {},
};

export const todoReducer = createReducer(
  initialState,
  on(todoActions.todoSet, (state, { todos }) => TodoUtils.setTodos(todos)),
  on(todoActions.todoAddSuccess, (state, { todo }) =>
    TodoUtils.addTodo(state, todo)
  ),
  on(todoActions.todoRemoveSuccess, (state, { id }) =>
    TodoUtils.removeTodo(state, id)
  )
);
