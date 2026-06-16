import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import { EmptyGroupNameError } from './set-group';

export class EmptySetNameError extends AppError {
  constructor() {
    super('EMPTY_SET_NAME', 'A set name cannot be empty');
  }
}

export type SetReleaseProps = {
  name: string;
  group: string;
  releaseDate: Date;
  releaseOrder: number;
};

export class SetRelease {
  private constructor(
    public readonly name: string,
    public readonly group: string,
    public readonly releaseDate: Date,
    public readonly releaseOrder: number,
  ) {}

  static create(
    props: SetReleaseProps,
  ): Result<SetRelease, EmptySetNameError | EmptyGroupNameError> {
    if (props.name.trim().length === 0) return err(new EmptySetNameError());
    if (props.group.trim().length === 0) return err(new EmptyGroupNameError());

    return ok(new SetRelease(props.name, props.group, props.releaseDate, props.releaseOrder));
  }
}
