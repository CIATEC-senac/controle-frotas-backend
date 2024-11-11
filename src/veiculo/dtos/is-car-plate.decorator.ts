import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCarPlate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCarPlate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          // Expressão regular para validar o formato da placa (ABC1D23)
          const regex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid car plate (e.g., ABC1D23)`;
        },
      },
    });
  };
}
