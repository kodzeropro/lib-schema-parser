import Schema from 'validno'
import type { TableFieldItem } from '../types.js'
import validateInput from '../../utils/validate-input.js'
import { MarkdownSpecs } from '../../types/table-types-specs.js'

enum Constants {
  Name = 'markdown',
  Title = 'Контент',
}

const defaultSpecs = (): MarkdownSpecs => {
  return {
    mayBeEmpty: true,
  }
}

export const markdownSpecsSchema = new Schema({
  mayBeEmpty: {
    type: Boolean,
    required: false,
  },
})

class TableFieldMarkdown implements TableFieldItem<MarkdownSpecs> {
  isNew?: boolean | undefined // Used only for openning field settings on creation
  key: string
  type: string
  title: string
  specs: MarkdownSpecs

  constructor(key: string, settings: Partial<MarkdownSpecs> = defaultSpecs()) {
    const settingsCombined: MarkdownSpecs = { ...defaultSpecs(), ...settings }
    validateInput(markdownSpecsSchema, settingsCombined)

    this.key = key
    this.type = Constants.Name
    this.title = Constants.Title

    this.specs = {
      mayBeEmpty: settingsCombined.mayBeEmpty,
    }
  }
}

export default TableFieldMarkdown

