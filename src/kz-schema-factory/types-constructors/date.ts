import Schema from 'validno'
import type { DateSpecs, TableFieldItem } from '../types.js'
import validateInput from '../../utils/validate-input.js'

enum Constants {
  Name = 'date',
  Title = 'Дата',
}

const defaultSpecs = (): DateSpecs => {
  return {
    min: null,
    max: null,
    mayBeEmpty: true,
    noTimezone: false,
  }
}

export const dateSpecsSchema = new Schema({
  min: {
    type: [Date, null],
    required: false,
  },
  max: {
    type: [Date, null],
    required: false,
  },
  mayBeEmpty: {
    type: Boolean,
    required: false,
  },
  noTimezone: {
    type: Boolean,
    required: false,
  },
})

class TableFieldDate implements TableFieldItem<DateSpecs> {
  key: string
  type: string
  title: string
  specs: DateSpecs

  constructor(key: string, settings: Partial<DateSpecs> = defaultSpecs()) {
    const combinedSettings: DateSpecs = { ...defaultSpecs(), ...settings }
    validateInput(dateSpecsSchema, combinedSettings)

    this.key = key
    this.type = Constants.Name
    this.title = Constants.Title
    this.specs = {
      min: combinedSettings.min,
      max: combinedSettings.max,
      mayBeEmpty: combinedSettings.mayBeEmpty,
      noTimezone: combinedSettings.noTimezone,
    }
  }
}

export default TableFieldDate
