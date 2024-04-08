declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    containsNumber(numberArray: number[]): Rule
    RequiredIfFieldHasValue(opt: { fieldName: string; fieldValue: string }): Rule
    numberLessThanField(fieldName: string): Rule
    maxNumber(maxNumber: number): Rule
    minNumber(minNumber: number): Rule
    slug(): Rule
  }
}
