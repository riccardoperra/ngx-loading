import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { createLoadingStore, someLoading } from 'ngx-reactive-loading';
import { TodoStateService } from '../02-loading-store-service-example/todo.service';
import { exhaustMap, mergeMap, Subject } from 'rxjs';
import { Todo } from '../../model/todo';
import { FormControl, Validators } from '@angular/forms';
import { UIStore } from '../../store/ui-store';

@Component({
  selector: 'app-loading-store-example',
  templateUrl: './loading-store-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStoreExampleComponent implements OnInit {
  readonly pageTitle$ = this.uiStore.pageTitle$;
  readonly todoTitle = new FormControl('', control =>
    Validators.required(control)
  );
  readonly todos$ = this.todoState.todos$;

  // Events
  readonly addEvent$: Subject<string> = new Subject<string>();
  readonly removeEvent$: Subject<string> = new Subject<string>();
  readonly reloadEvent$: Subject<void> = new Subject<void>();

  // Loading
  readonly loadingStore = createLoadingStore([
    'addTodo',
    'removeTodo',
    'reloadTodo',
  ]);

  readonly isReloading$ = this.loadingStore.reloadTodo.$;

  readonly isLoading$ = someLoading([
    this.loadingStore.addTodo,
    this.loadingStore.removeTodo,
  ]);

  readonly someLoading = someLoading([this.isReloading$, this.isLoading$]);

  // UI
  readonly trackByTodo: TrackByFunction<Todo> = (_, todo) => todo.id;

  constructor(
    private readonly todoState: TodoStateService,
    private readonly uiStore: UIStore
  ) {}

  ngOnInit() {
    this.reloadEvent$
      .pipe(
        exhaustMap(() =>
          this.todoState
            .reloadTodos()
            .pipe(this.loadingStore.reloadTodo.track())
        )
      )
      .subscribe();

    this.addEvent$
      .pipe(
        mergeMap(title =>
          this.todoState.addTodo(title).pipe(this.loadingStore.addTodo.track())
        )
      )
      .subscribe();

    this.removeEvent$
      .pipe(
        exhaustMap(id =>
          this.todoState
            .removeTodo(id)
            .pipe(this.loadingStore.removeTodo.track())
        )
      )
      .subscribe();
  }
}
