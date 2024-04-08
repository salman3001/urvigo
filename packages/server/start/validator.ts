// /*
// |--------------------------------------------------------------------------
// | Preloaded File
// |--------------------------------------------------------------------------
// |
// | Any code written inside this file will be executed during the application
// | boot.
// |
// */
import { validator } from '@ioc:Adonis/Core/Validator'
// import Database from '@ioc:Adonis/Lucid/Database'
// import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Orm'

validator.rule(
  'containsNumber',
  async (value, [numberArray], options) => {
    if (typeof value !== 'number' && !Array.isArray(numberArray)) {
      return
    }

    if (!numberArray.includes(value)) {
      options.errorReporter.report(
        options.pointer,
        `Not a valid number. choices ${(numberArray as []).toString()}`,
        `Not a valid number. choices ${(numberArray as []).toString()}`,
        options.arrayExpressionPointer
      )
    }
  },
  () => ({ async: true })
)

validator.rule('RequiredIfFieldHasValue', (value, [opt], options) => {
  const fieldName = opt?.fieldName
  const fieldValue = opt?.fieldValue

  if (options.tip[fieldName] === fieldValue && value != null) {
    return
  } else {
    options.errorReporter.report(
      options.pointer,
      `The field is required if ${fieldName} value is  ${fieldValue}`,
      `The field ${fieldName} must have ${fieldValue}`,
      options.arrayExpressionPointer
    )
  }
})

validator.rule('numberLessThanField', (value, [fieldName], options) => {
  if (typeof value !== 'number') {
    return
  }

  if (options.tip[fieldName] > value) {
    return
  } else {
    options.errorReporter.report(
      options.pointer,
      `The value ${value} must be less than ${fieldName} field`,
      `The value ${value} must be less than ${fieldName} field`,
      options.arrayExpressionPointer
    )
  }
})

validator.rule('maxNumber', (value, [maxNumber], options) => {
  if (typeof value !== 'number') {
    return
  }

  if (value <= maxNumber) {
    return
  } else {
    options.errorReporter.report(
      options.pointer,
      `The value  must be less than or equal to ${maxNumber}`,
      `The value  must be less than or equal to ${maxNumber}`,
      options.arrayExpressionPointer
    )
  }
})

validator.rule('minNumber', (value, [minNumber], options) => {
  if (typeof value !== 'number') {
    return
  }

  if (value >= minNumber) {
    return
  } else {
    options.errorReporter.report(
      options.pointer,
      `The value  must be greater than or equal to  ${minNumber}`,
      `The value  must be greater than or equal to ${minNumber}`,
      options.arrayExpressionPointer
    )
  }
})

validator.rule('slug', (value, [opt], options) => {
  if (typeof value !== 'string') {
    return
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  if (value.match(slugRegex)) {
    return
  } else {
    options.errorReporter.report(
      options.pointer,
      `The value  must be a valid slug`,
      `The value  must be a valid slug`,
      options.arrayExpressionPointer
    )
  }
})
