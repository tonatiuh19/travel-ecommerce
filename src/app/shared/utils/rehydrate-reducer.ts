import {
  Action,
  ActionCreator,
  ActionReducer,
  ActionType,
  createReducer,
  ReducerTypes,
} from '@ngrx/store';

interface RehydrateRecucerConfig {
  key: string;
}

export function createRehydrateReducer<S, A extends Action = Action>(
  config: RehydrateRecucerConfig,
  initialState: S,
  ...ons: ReducerTypes<S, ActionCreator[]>[]
): ActionReducer<S, A> {
  const { key } = config;
  const item = localStorage.getItem(key);
  const newInitialState = (item && JSON.parse(item)) ?? initialState;

  const newOns: ReducerTypes<S, ActionCreator[]>[] = [];
  ons.forEach((oldOn: ReducerTypes<S, ActionCreator[]>) => {
    const newReducer = (
      state: S,
      action: ActionType<ActionCreator[][number]>
    ) => {
      const newState = oldOn.reducer(state, action);
      localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    };
    newOns.push({ ...oldOn, reducer: newReducer });
  });
  return createReducer(newInitialState, ...newOns);
}
