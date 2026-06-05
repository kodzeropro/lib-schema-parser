import Schema from 'validno'
import type { MarkdownSpecs, TableFieldItem } from '../types.js'
import validateInput from '../../utils/validate-input.js'

enum Constants {
  Name = 'markdown',
  Title = 'Контент',
}

const defaultSpecs = (): MarkdownSpecs => {
  return {
    mayBeEmpty: true,
  }
}

const inputSchema = new Schema({
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
    validateInput(inputSchema, settingsCombined)

    this.key = key
    this.type = Constants.Name
    this.title = Constants.Title

    this.specs = {
      mayBeEmpty: settingsCombined.mayBeEmpty,
    }
  }
}

export default TableFieldMarkdown