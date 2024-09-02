import { createAction, props } from '@ngrx/store';

const actor = '[Landing]';

export const getPackages = createAction(
  `${actor} Get Packages`,
  props<{ userId: string }>()
);

export const getPackagesSuccess = createAction(
  `${actor} Get Packages Success`,
  props<{ packagesResponse: any }>()
);

export const getPackagesFailure = createAction(
  `${actor} Get Packages Failure`,
  props<{ errorResponse: any }>()
);
