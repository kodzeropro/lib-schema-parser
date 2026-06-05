import Schema from 'validno'
import validateInput from '../../utils/validate-input.js'
import { FileSpecs, TableFieldItem } from '../types.js'

enum Constants {
  Name = 'file',
  Title = 'Файл',
}

const defaultSpecs = (): FileSpecs => {
  return {
    multiple: false,
    maxSize: 0,
    mayBeEmpty: true,
    allowedMimeTypes: [],
  }
}

const schemaDefinition: Record<
  keyof FileSpecs,
  { type: unknown; required?: boolean; eachType?: unknown }
> = {
  multiple: {
    type: Boolean,
  },
  maxSize: {
    type: Number,
  },
  mayBeEmpty: {
    type: Boolean,
    required: false,
  },
  allowedMimeTypes: {
    type: Array,
    eachType: String,
    required: false,
  },
}

export const fileSpecsSchema = new Schema(schemaDefinition)

class TableFieldFile implements TableFieldItem<FileSpecs> {
  isNew?: boolean | undefined // Used only for openning field settings on creation
  key: string
  type: string
  title: string
  specs: FileSpecs

  constructor(key: string, settings: Partial<FileSpecs> = defaultSpecs()) {
    const settingsCombined: FileSpecs = { ...defaultSpecs(), ...settings }
    validateInput(fileSpecsSchema, settingsCombined)

    this.key = key
    this.type = Constants.Name
    this.title = Constants.Title

    this.specs = {
      multiple: settingsCombined.multiple,
      maxSize: settingsCombined.maxSize,
      allowedMimeTypes: settingsCombined.allowedMimeTypes,
      mayBeEmpty: settingsCombined.mayBeEmpty,
    }
  }
}

export default TableFieldFile
