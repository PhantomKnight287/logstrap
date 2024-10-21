import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsType(
  types: any[],
  { isOptional }: { isOptional?: boolean } = {},
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isType',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [types],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [types] = args.constraints;
          return types.some((type: any) => {
            if (
              isOptional &&
              (value === null || value === undefined || value === '')
            ) {
              return true;
            }
            if (type === String) {
              return typeof value === 'string';
            } else if (type === Number) {
              return typeof value === 'number';
            } else if (type === Boolean) {
              return typeof value === 'boolean';
            } else if (type === Array) {
              return Array.isArray(value);
            } else if (type === Object) {
              return (
                typeof value === 'object' &&
                value !== null &&
                !Array.isArray(value)
              );
            } else {
              return value instanceof type;
            }
          });
        },
        defaultMessage(args: ValidationArguments) {
          const [types] = args.constraints;
          const typeNames = types.map((type: any) => type.name).join(', ');
          return `${args.property} must be of type(s): ${typeNames}`;
        },
      },
    });
  };
}
